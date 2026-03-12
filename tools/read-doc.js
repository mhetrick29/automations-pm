/**
 * Document Text Extractor
 * Extracts text from Office documents (.docx, .pptx, .xlsx, .doc, .ppt, .xls)
 * 
 * Supports both:
 * - Modern Office Open XML formats (ZIP-based) 
 * - Legacy OLE Compound Document formats (binary)
 * 
 * Usage: node read-doc.js "path/to/file.docx" [maxChars]
 */

import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { extname, join } from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';
import JSZip from 'jszip';
import { parseStringPromise } from 'xml2js';
import mammoth from 'mammoth';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node read-doc.js "path/to/file" [maxChars]');
  process.exit(1);
}

const ext = extname(filePath).toLowerCase();

// Check if file is legacy OLE format (D0 CF 11 E0) or modern ZIP (50 4B 03 04)
function isLegacyFormat(buffer) {
  return buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0;
}

// Helper to run PowerShell script via temp file
function runPsScript(script) {
  const tempFile = join(tmpdir(), `extract-${Date.now()}.ps1`);
  try {
    writeFileSync(tempFile, script, 'utf-8');
    return execSync(`powershell -ExecutionPolicy Bypass -File "${tempFile}"`, { 
      encoding: 'utf-8', 
      maxBuffer: 10 * 1024 * 1024 
    });
  } finally {
    try { unlinkSync(tempFile); } catch {}
  }
}

// Extract text from legacy formats using PowerShell COM automation
function extractLegacyDoc(filePath) {
  const script = `
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
  $doc = $word.Documents.Open('${filePath.replace(/'/g, "''")}', $false, $true)
  $paragraphs = @()
  foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text.Trim()
    if ($text) { $paragraphs += $text }
  }
  $doc.Close($false)
  Write-Output ($paragraphs -join "\`n\`n")
} finally {
  $word.Quit()
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}
`;
  try {
    return runPsScript(script);
  } catch (e) {
    return `Error reading legacy doc: ${e.message}`;
  }
}

function extractLegacyPpt(filePath) {
  const script = `
$ppt = New-Object -ComObject PowerPoint.Application
try {
  $presentation = $ppt.Presentations.Open('${filePath.replace(/'/g, "''")}', $true, $false, $false)
  $text = @()
  foreach ($slide in $presentation.Slides) {
    foreach ($shape in $slide.Shapes) {
      if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
        $text += $shape.TextFrame.TextRange.Text
      }
    }
  }
  $presentation.Close()
  Write-Output ($text -join ' ')
} finally {
  $ppt.Quit()
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
}
`;
  try {
    return runPsScript(script);
  } catch (e) {
    return `Error reading legacy ppt: ${e.message}`;
  }
}

function extractLegacyXls(filePath) {
  const script = `
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
  $wb = $excel.Workbooks.Open('${filePath.replace(/'/g, "''")}', 0, $true)
  $text = @()
  foreach ($sheet in $wb.Sheets) {
    $used = $sheet.UsedRange
    for ($r = 1; $r -le [Math]::Min($used.Rows.Count, 100); $r++) {
      for ($c = 1; $c -le [Math]::Min($used.Columns.Count, 20); $c++) {
        $val = $used.Cells($r, $c).Text
        if ($val) { $text += $val }
      }
    }
  }
  $wb.Close($false)
  Write-Output ($text -join ' | ')
} finally {
  $excel.Quit()
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
`;
  try {
    return runPsScript(script);
  } catch (e) {
    return `Error reading legacy xls: ${e.message}`;
  }
}

async function extractDocx(buffer) {
  // mammoth produces clean, structured text with proper paragraph separation
  const result = await mammoth.extractRawText({ buffer });
  return result.value || 'Could not parse document';
}

async function extractPptx(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const texts = [];
  
  // Get all slide files
  const slideFiles = Object.keys(zip.files).filter(f => f.match(/ppt\/slides\/slide\d+\.xml/));
  slideFiles.sort();
  
  for (const slideFile of slideFiles) {
    const slideXml = await zip.file(slideFile)?.async('string');
    if (slideXml) {
      const result = await parseStringPromise(slideXml);
      
      function extractText(obj) {
        if (typeof obj === 'string') return obj;
        if (Array.isArray(obj)) return obj.map(extractText).join(' ');
        if (obj && typeof obj === 'object') {
          if (obj['a:t']) return extractText(obj['a:t']);
          return Object.values(obj).map(extractText).join(' ');
        }
        return '';
      }
      
      const text = extractText(result);
      if (text.trim()) {
        texts.push(text.replace(/\s+/g, ' ').trim());
      }
    }
  }
  
  return texts.join('\n\n');
}

async function extractXlsx(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  
  // Get shared strings (where text is stored)
  const stringsXml = await zip.file('xl/sharedStrings.xml')?.async('string');
  const strings = [];
  
  if (stringsXml) {
    const result = await parseStringPromise(stringsXml);
    const sst = result?.sst?.si || [];
    
    for (const si of sst) {
      if (si.t) {
        strings.push(Array.isArray(si.t) ? si.t.join('') : si.t);
      } else if (si.r) {
        // Rich text
        const parts = si.r.map(r => r.t).flat().filter(Boolean);
        strings.push(parts.join(''));
      }
    }
  }
  
  return strings.slice(0, 200).join(' | '); // Limit output
}

try {
  const buffer = readFileSync(filePath);
  let text = '';
  
  // Check file format and route to appropriate extractor
  const isLegacy = isLegacyFormat(buffer);
  
  if (isLegacy) {
    console.error('(Legacy format detected, using COM automation...)');
    if (ext === '.doc' || ext === '.docx') {
      text = extractLegacyDoc(filePath);
    } else if (ext === '.ppt' || ext === '.pptx' || ext === '.pptm') {
      text = extractLegacyPpt(filePath);
    } else if (ext === '.xls' || ext === '.xlsx') {
      text = extractLegacyXls(filePath);
    }
  } else {
    // Modern ZIP-based format
    if (ext === '.docx') {
      text = await extractDocx(buffer);
    } else if (ext === '.pptx' || ext === '.pptm') {
      text = await extractPptx(buffer);
    } else if (ext === '.xlsx') {
      text = await extractXlsx(buffer);
    } else {
      // Try as plain text
      text = buffer.toString('utf-8');
    }
  }
  
  // Output full text (or limit via arg)
  const maxChars = parseInt(process.argv[3]) || 50000;
  console.log(text.substring(0, maxChars));
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
