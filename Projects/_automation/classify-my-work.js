/**
 * End-of-Day Document Classifier
 * Scans recently modified documents and classifies them into projects
 * 
 * Usage: node classify-my-work.js [--days N] [--move]
 *   --days N    Look back N days (default: 1)
 *   --move      Actually move files (default: dry run)
 */

import { readdirSync, statSync, existsSync, mkdirSync, copyFileSync, readFileSync } from 'fs';
import { extname, basename, dirname, join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_DIR = join(__dirname, '..');
const ONEDRIVE = dirname(PROJECTS_DIR);
const NEEDS_SORTING = join(PROJECTS_DIR, '_needs-sorting');

// Parse args
const args = process.argv.slice(2);
const daysBack = args.includes('--days') ? parseInt(args[args.indexOf('--days') + 1]) : 1;
const shouldMove = args.includes('--move');
const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

// Document extensions to scan (Office docs and plain text, excluding .md)
const DOC_EXTENSIONS = ['.doc', '.docx', '.ppt', '.pptx', '.pptm', '.xls', '.xlsx', '.txt'];

// Folders to skip
const SKIP_FOLDERS = ['node_modules', '.git', 'AppData', 'cache', 'Cache', '_automation'];

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                 📋 CLASSIFY MY WORK                          ║
║                 End-of-Day Document Sorter                    ║
╚══════════════════════════════════════════════════════════════╝

📅 Looking for files modified in the last ${daysBack} day(s)
📂 Scanning: ${ONEDRIVE}
${shouldMove ? '✅ MOVE MODE: Files will be moved' : '👀 DRY RUN: Preview only (use --move to actually move)'}
`);

// Find recently modified documents
function findRecentDocs(dir, depth = 0) {
  const results = [];
  if (depth > 5) return results; // Limit recursion
  
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (SKIP_FOLDERS.some(skip => entry.name.includes(skip))) continue;
        if (entry.name.startsWith('.')) continue;
        results.push(...findRecentDocs(fullPath, depth + 1));
      } else {
        const ext = extname(entry.name).toLowerCase();
        if (!DOC_EXTENSIONS.includes(ext)) continue;
        
        try {
          const stat = statSync(fullPath);
          if (stat.mtime > cutoffDate) {
            // Skip if already in a project folder
            if (fullPath.includes(join('Projects', ''))) continue;
            
            results.push({
              path: fullPath,
              name: entry.name,
              modified: stat.mtime,
              size: stat.size
            });
          }
        } catch (e) {
          // Skip files we can't stat
        }
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }
  
  return results;
}

// Load projects for classification
function loadProjects() {
  const projects = [];
  const entries = readdirSync(PROJECTS_DIR, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
    
    const manifestPath = join(PROJECTS_DIR, entry.name, 'manifest.yaml');
    if (!existsSync(manifestPath)) continue;
    
    try {
      const content = readFileSync(manifestPath, 'utf-8');
      const manifest = parseYaml(content);
      
      // Extract keywords
      const keywords = new Set();
      if (manifest.project?.name) {
        manifest.project.name.toLowerCase().split(/\s+/).forEach(w => keywords.add(w));
      }
      if (manifest.tags) {
        manifest.tags.forEach(t => keywords.add(t.toLowerCase()));
      }
      if (manifest.project?.description) {
        const techTerms = manifest.project.description.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
        techTerms.forEach(t => keywords.add(t));
      }
      if (manifest.github?.repos) {
        manifest.github.repos.forEach(r => r.name && keywords.add(r.name.toLowerCase()));
      }
      
      // Filter stop words
      const stopWords = new Set([
        'the', 'and', 'for', 'with', 'from', 'that', 'this', 'more', 'into', 'been',
        'brain', 'azure', 'microsoft', 'service', 'health', 'monitor', 'monitors',
        'outage', 'detection', 'automation', 'aiops', 'sli', 'slis'
      ]);
      
      projects.push({
        name: manifest.project?.name || entry.name,
        folder: entry.name,
        path: join(PROJECTS_DIR, entry.name),
        keywords: [...keywords].filter(k => k.length > 2 && !stopWords.has(k))
      });
    } catch (e) {}
  }
  
  return projects;
}

// Classify a single document
function classifyDoc(filePath, projects) {
  try {
    const text = execSync(`node "${join(__dirname, 'read-doc.js')}" "${filePath}" 2>&1`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
      timeout: 60000
    }).toLowerCase();
    
    if (!text || text.length < 20) return null;
    
    let bestMatch = null;
    let bestScore = 0;
    
    for (const project of projects) {
      let score = 0;
      for (const keyword of project.keywords) {
        const regex = new RegExp(`\\b${keyword.replace(/-/g, '[\\s-]?')}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) score += matches.length;
      }
      
      // Project name bonus
      const nameRegex = new RegExp(project.name.replace(/\s+/g, '[\\s-]+'), 'gi');
      if (text.match(nameRegex)) score += 5;
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = project;
      }
    }
    
    if (bestScore > 10) {
      return { project: bestMatch, score: bestScore, confidence: 'high' };
    } else if (bestScore > 0) {
      return { project: bestMatch, score: bestScore, confidence: 'low', needsReview: true };
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

// Main execution
console.log('🔍 Scanning for recent documents...\n');

const recentDocs = findRecentDocs(ONEDRIVE);
console.log(`Found ${recentDocs.length} recently modified document(s)\n`);

if (recentDocs.length === 0) {
  console.log('✨ No new documents to classify. Great job staying organized!\n');
  process.exit(0);
}

const projects = loadProjects();
console.log(`📁 ${projects.length} project(s) available for classification\n`);
console.log('─'.repeat(65));

const results = {
  classified: [],
  needsReview: [],
  failed: []
};

for (const doc of recentDocs) {
  process.stdout.write(`\n📄 ${doc.name}`);
  
  const result = classifyDoc(doc.path, projects);
  
  if (result && result.confidence === 'high') {
    console.log(` → 🟢 ${result.project.name} (score: ${result.score})`);
    results.classified.push({ doc, result });
    
    if (shouldMove) {
      const destDir = join(result.project.path, 'documents');
      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
      const destPath = join(destDir, doc.name);
      try {
        copyFileSync(doc.path, destPath);
        console.log(`   ✅ Copied to ${result.project.folder}/documents/`);
      } catch (e) {
        console.log(`   ❌ Failed to copy: ${e.message}`);
      }
    }
  } else if (result && result.needsReview) {
    console.log(` → 🟡 Maybe: ${result.project.name} (score: ${result.score}) - needs review`);
    results.needsReview.push({ doc, result });
  } else {
    console.log(` → ⚪ No match`);
    results.failed.push({ doc });
    
    if (shouldMove) {
      if (!existsSync(NEEDS_SORTING)) mkdirSync(NEEDS_SORTING, { recursive: true });
      const destPath = join(NEEDS_SORTING, doc.name);
      try {
        copyFileSync(doc.path, destPath);
        console.log(`   📥 Copied to _needs-sorting/`);
      } catch (e) {
        console.log(`   ❌ Failed to copy: ${e.message}`);
      }
    }
  }
}

// Summary
console.log(`
${'─'.repeat(65)}
📊 SUMMARY
${'─'.repeat(65)}
  🟢 High confidence:  ${results.classified.length} file(s)
  🟡 Needs review:     ${results.needsReview.length} file(s)
  ⚪ No match:         ${results.failed.length} file(s)
${shouldMove ? '\n  ✅ Files have been copied to their destinations' : '\n  👀 Dry run - use --move to actually move files'}
`);

if (results.needsReview.length > 0) {
  console.log('📝 Files needing manual review:');
  for (const { doc, result } of results.needsReview) {
    console.log(`   - ${doc.name} (best guess: ${result.project.name})`);
  }
}
