/**
 * Markdown to Word (.docx) Converter
 * Converts a Markdown file to a Word document using pandoc.
 *
 * Pandoc renders markdown pipe tables → Word tables, **bold** → Word Bold,
 * # headings → Word Heading styles — all Epic Spec Template sections render
 * correctly out of the box.
 *
 * Usage: node md-to-docx.js "path/to/file.md" ["path/to/output.docx"]
 */

import { existsSync } from 'fs';
import { resolve, dirname, basename, extname, join } from 'path';
import { execSync } from 'child_process';

const inputArg = process.argv[2];
const outputArg = process.argv[3];

if (!inputArg) {
  console.error('Usage: node md-to-docx.js "path/to/file.md" ["path/to/output.docx"]');
  process.exit(1);
}

const inputPath = resolve(inputArg);
if (!existsSync(inputPath)) {
  console.error(`File not found: ${inputPath}`);
  process.exit(1);
}

const outputPath = outputArg
  ? resolve(outputArg)
  : join(dirname(inputPath), `${basename(inputPath, extname(inputPath))}.docx`);

function findPandoc() {
  try {
    execSync('pandoc --version', { stdio: 'pipe' });
    return 'pandoc';
  } catch {}
  const fallback = 'C:\\Users\\mhetrick\\AppData\\Local\\Pandoc\\pandoc.exe';
  return existsSync(fallback) ? fallback : null;
}

const pandocPath = findPandoc();
if (!pandocPath) {
  console.error('pandoc not found. Install: winget install JohnMacFarlane.Pandoc');
  process.exit(1);
}

// Paths quoted to handle spaces (common in OneDrive paths)
const cmd = `"${pandocPath}" --from markdown --to docx -o "${outputPath}" "${inputPath}"`;

try {
  execSync(cmd, { stdio: 'pipe' });
  console.log(`Success: ${outputPath}`);
} catch (err) {
  console.error('Conversion failed:');
  console.error(err.stderr?.toString() || err.message);
  process.exit(1);
}
