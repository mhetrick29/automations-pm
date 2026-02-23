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

// --- Commands ---

function showStatus() {
  const config = loadConfig();
  const syncState = loadSyncState();
  const allFiles = [...(config.files || []), ...(config.images || [])];

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           📚 Team Knowledge Sync Status                ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  SharePoint: ${config.sharepoint?.site || 'not configured'}`);
  console.log(`║  Folder:     ${config.sharepoint?.folder || 'not configured'}`);
  console.log(`║  Local:      ${TEAM_KNOWLEDGE_DIR}`);
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
    console.log(`  ${icon} ${entry.local}${desc}`);
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
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           📥 Pull from SharePoint                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log();
  console.log('SharePoint sync requires Copilot agent with Work IQ access.');
  console.log('The agent will:');
  console.log('  1. Read the config to find SharePoint file locations');
  console.log('  2. Use Work IQ / Graph API to download updated files');
  console.log('  3. Write them to team-knowledge/ locally');
  console.log('  4. Run --mark-synced to update the sync baseline');
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
  case '--help':
    console.log('Usage: node tools/fetch-knowledge.js [command] [file]');
    console.log();
    console.log('Commands:');
    console.log('  --status        Show sync status of all files (default)');
    console.log('  --pull [file]   Pull updates from SharePoint');
    console.log('  --snapshot      Mark current local files as sync baseline');
    console.log('  --mark-synced   Mark files as synced after agent pull');
    console.log('  --help          Show this help');
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error('Run with --help for usage.');
    process.exit(1);
}
