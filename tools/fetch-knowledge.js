#!/usr/bin/env node
/**
 * fetch-knowledge.js — Team Knowledge Sync Tool
 *
 * Compares local team-knowledge files against SharePoint source,
 * shows what's changed, and lets the user choose what to update.
 *
 * Usage:
 *   node tools/fetch-knowledge.js              # Interactive: show status of all files
 *   node tools/fetch-knowledge.js --status      # Show sync status (no changes)
 *   node tools/fetch-knowledge.js --pull         # Pull all updated files from SharePoint
 *   node tools/fetch-knowledge.js --pull <file>  # Pull a specific file
 *
 * Environment:
 *   TEAM_KNOWLEDGE_DIR  Override local team-knowledge path
 *                       (default: ../team-knowledge relative to this script)
 *
 * Note: This tool is designed to be called by Copilot agents at session start.
 * The agent reads the output and offers to sync if updates are available.
 * SharePoint access requires the Work IQ MCP tool or Graph API credentials.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Paths ---
const TEAM_KNOWLEDGE_DIR = process.env.TEAM_KNOWLEDGE_DIR
  || path.join(__dirname, '..', 'team-knowledge');
const CONFIG_PATH = path.join(TEAM_KNOWLEDGE_DIR, 'config.yaml');
const SYNC_STATE_PATH = path.join(TEAM_KNOWLEDGE_DIR, '.sync-state.json');

// --- Helpers ---

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('❌ Config not found:', CONFIG_PATH);
    console.error('   Run from the Automations repo root or set TEAM_KNOWLEDGE_DIR.');
    process.exit(1);
  }
  return yaml.load(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function loadSyncState() {
  if (fs.existsSync(SYNC_STATE_PATH)) {
    return JSON.parse(fs.readFileSync(SYNC_STATE_PATH, 'utf8'));
  }
  return { files: {} };
}

function saveSyncState(state) {
  fs.writeFileSync(SYNC_STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function fileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function fileModTime(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.statSync(filePath).mtime.toISOString();
}

function formatAge(isoDate) {
  if (!isoDate) return 'never';
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

/** Check if a remote file needs conversion (e.g. .docx → .md) */
function needsConversion(remoteFile, localFile) {
  const remoteExt = path.extname(remoteFile).toLowerCase();
  const localExt = path.extname(localFile).toLowerCase();
  const officeExts = ['.docx', '.pptx', '.xlsx', '.doc', '.ppt', '.xls'];
  return officeExts.includes(remoteExt) && localExt === '.md';
}

/**
 * Convert an Office document to markdown text using read-doc.js.
 * @param {string} docPath - Path to the .docx/.pptx file
 * @param {string} mdPath - Path to write the .md output
 */
function convertDocToMd(docPath, mdPath) {
  const readDocScript = path.join(__dirname, 'read-doc.js');
  if (!fs.existsSync(readDocScript)) {
    console.error(`  ❌ Converter not found: ${readDocScript}`);
    return false;
  }
  try {
    const text = execSync(`node "${readDocScript}" "${docPath}"`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
    // Ensure parent directory exists
    const dir = path.dirname(mdPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(mdPath, text, 'utf8');
    return true;
  } catch (err) {
    console.error(`  ❌ Conversion failed for ${docPath}: ${err.message}`);
    return false;
  }
}

// --- Commands ---

function showStatus() {
  const config = loadConfig();
  const syncState = loadSyncState();
  const allFiles = [...(config.files || []), ...(config.images || [])];

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           📚 Team Knowledge Sync Status                ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  Local:      ${TEAM_KNOWLEDGE_DIR}`);
  console.log(`║  SharePoint: ${config.sharepoint?.site || 'not configured'}`);
  console.log(`║    Folder:   ${config.sharepoint?.folder || 'not configured'}`);
  const adoRepo = config.ado_repo;
  if (adoRepo) {
    const adoStatus = adoRepo.enabled ? '✅ enabled' : '⏸️  not yet enabled';
    console.log(`║  ADO Repo:   ${adoStatus}${adoRepo.repository ? ` (${adoRepo.repository})` : ''}`);
    if (adoRepo.areas?.length) {
      console.log(`║    Areas:    ${adoRepo.areas.map(a => a.name).join(', ')}`);
    }
  }
  const mcp = config.mcp;
  if (mcp) {
    const mcpStatus = mcp.enabled ? '✅ enabled' : '⏸️  not yet enabled';
    console.log(`║  MCP:        ${mcpStatus}${mcp.tool_name ? ` (${mcp.tool_name})` : ''}`);
  }
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log();

  let modified = 0;
  let missing = 0;
  let synced = 0;

  for (const entry of allFiles) {
    const localPath = path.join(TEAM_KNOWLEDGE_DIR, entry.local);
    const exists = fs.existsSync(localPath);
    const currentHash = fileHash(localPath);
    const lastSync = syncState.files[entry.local];
    const lastSyncHash = lastSync?.hash;
    const lastSyncDate = lastSync?.syncedAt;

    let status, icon;
    if (!exists) {
      status = 'MISSING';
      icon = '❌';
      missing++;
    } else if (!lastSyncHash) {
      status = `local only (modified ${formatAge(fileModTime(localPath))})`;
      icon = '🔶';
      modified++;
    } else if (currentHash !== lastSyncHash) {
      status = `modified locally since last sync (${formatAge(lastSyncDate)})`;
      icon = '🔶';
      modified++;
    } else {
      status = `synced ${formatAge(lastSyncDate)}`;
      icon = '✅';
      synced++;
    }

    const desc = entry.description ? ` — ${entry.description}` : '';
    const convNote = needsConversion(entry.remote, entry.local) ? ' [docx→md]' : '';
    console.log(`  ${icon} ${entry.local}${convNote}${desc}`);
    console.log(`     ${status}`);
  }

  console.log();
  console.log(`Summary: ${synced} synced, ${modified} modified/unsynced, ${missing} missing`);
  console.log();

  if (modified > 0 || missing > 0) {
    console.log('💡 To pull updates from SharePoint:');
    console.log('   node tools/fetch-knowledge.js --pull');
    console.log();
    console.log('💡 To mark current local files as the sync baseline:');
    console.log('   node tools/fetch-knowledge.js --snapshot');
  }
}

function takeSnapshot(specificFile) {
  const config = loadConfig();
  const syncState = loadSyncState();
  const allFiles = [...(config.files || []), ...(config.images || [])];

  let count = 0;
  for (const entry of allFiles) {
    if (specificFile && entry.local !== specificFile) continue;
    const localPath = path.join(TEAM_KNOWLEDGE_DIR, entry.local);
    const hash = fileHash(localPath);
    if (hash) {
      syncState.files[entry.local] = {
        hash,
        syncedAt: new Date().toISOString(),
        source: 'local-snapshot'
      };
      count++;
    }
  }

  saveSyncState(syncState);
  console.log(`📸 Snapshot taken for ${count} files. These are now the sync baseline.`);
}

function pullFromSharePoint(specificFile) {
  // SharePoint pull requires Graph API or Work IQ MCP integration.
  // This function provides the interface — actual download is done
  // by the Copilot agent using MCP tools, then calling --mark-synced.
  const config = loadConfig();
  const autoConvert = config.conversion?.auto_convert !== false;

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           📥 Pull from SharePoint                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log();
  console.log('SharePoint sync requires Copilot agent with Work IQ access.');
  console.log('The agent will:');
  console.log('  1. Read the config to find SharePoint file locations');
  console.log('  2. Use Work IQ / Graph API to download updated files');
  if (autoConvert) {
    console.log('  3. If remote is .docx/.pptx and local is .md, auto-convert');
    console.log('     using read-doc.js (extracts text to markdown)');
    console.log('  4. Write them to team-knowledge/ locally');
    console.log('  5. Run --mark-synced to update the sync baseline');
  } else {
    console.log('  3. Write them to team-knowledge/ locally');
    console.log('  4. Run --mark-synced to update the sync baseline');
  }
  console.log();
  console.log('To trigger this, ask the agent:');
  console.log('  "Sync my team knowledge from SharePoint"');
  console.log();

  if (specificFile) {
    console.log(`Requested file: ${specificFile}`);
  }

  // Show what would be pulled
  showStatus();
}

function markSynced(specificFile) {
  // Called after agent successfully pulls files from SharePoint
  const config = loadConfig();
  const syncState = loadSyncState();
  const allFiles = [...(config.files || []), ...(config.images || [])];

  let count = 0;
  for (const entry of allFiles) {
    if (specificFile && entry.local !== specificFile) continue;
    const localPath = path.join(TEAM_KNOWLEDGE_DIR, entry.local);
    const hash = fileHash(localPath);
    if (hash) {
      syncState.files[entry.local] = {
        hash,
        syncedAt: new Date().toISOString(),
        source: 'sharepoint'
      };
      count++;
    }
  }

  saveSyncState(syncState);
  console.log(`✅ Marked ${count} files as synced from SharePoint.`);
}

/**
 * Convert a downloaded Office doc to markdown.
 * Usage: --convert <downloaded.docx> [<output.md>]
 * If output is not specified, derives from config mapping or replaces extension.
 */
function convertFile(inputFile, outputFile) {
  if (!inputFile) {
    console.error('❌ Usage: --convert <file.docx> [output.md]');
    process.exit(1);
  }

  const inputPath = path.resolve(inputFile);
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  // Determine output path
  let outPath;
  if (outputFile) {
    outPath = path.resolve(outputFile);
  } else {
    // Try to find mapping in config
    const config = loadConfig();
    const allFiles = [...(config.files || [])];
    const inputBasename = path.basename(inputPath);
    const mapping = allFiles.find(e =>
      path.basename(e.remote) === inputBasename ||
      path.basename(e.remote, path.extname(e.remote)) === path.basename(inputBasename, path.extname(inputBasename))
    );
    if (mapping) {
      outPath = path.join(TEAM_KNOWLEDGE_DIR, mapping.local);
    } else {
      // Default: same name with .md extension
      outPath = inputPath.replace(/\.(docx|pptx|xlsx|doc|ppt|xls)$/i, '.md');
    }
  }

  console.log(`📄 Converting: ${inputPath}`);
  console.log(`📝 Output:     ${outPath}`);

  const success = convertDocToMd(inputPath, outPath);
  if (success) {
    console.log('✅ Conversion complete.');
    // Show file size
    const stat = fs.statSync(outPath);
    console.log(`   ${(stat.size / 1024).toFixed(1)} KB written`);
  }
}

// --- CLI ---

const args = process.argv.slice(2);
const command = args[0];
const fileArg = args[1];

switch (command) {
  case '--status':
  case undefined:
    showStatus();
    break;
  case '--pull':
    pullFromSharePoint(fileArg);
    break;
  case '--snapshot':
    takeSnapshot(fileArg);
    break;
  case '--mark-synced':
    markSynced(fileArg);
    break;
  case '--convert':
    convertFile(fileArg, args[2]);
    break;
  case '--help':
    console.log('Usage: node tools/fetch-knowledge.js [command] [file]');
    console.log();
    console.log('Commands:');
    console.log('  --status           Show sync status of all files (default)');
    console.log('  --pull [file]      Pull updates from SharePoint');
    console.log('  --snapshot         Mark current local files as sync baseline');
    console.log('  --mark-synced      Mark files as synced after agent pull');
    console.log('  --convert <file>   Convert a .docx/.pptx to .md using read-doc.js');
    console.log('  --help             Show this help');
    console.log();
    console.log('Conversion:');
    console.log('  When SharePoint files are .docx/.pptx and local targets are .md,');
    console.log('  the agent should download the Office file, then run:');
    console.log('    node tools/fetch-knowledge.js --convert <downloaded.docx> [output.md]');
    console.log('  If output is omitted, it uses the config mapping or replaces the extension.');
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Run with --help for usage.');
    process.exit(1);
}
