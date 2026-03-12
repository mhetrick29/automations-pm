/**
 * SharePoint File Downloader
 * Downloads files from SharePoint via Microsoft Graph API /shares endpoint.
 * Works with any SharePoint sharing URL (e.g., :w: links, direct file links).
 *
 * Usage:
 *   node download-sharepoint.js <sharepoint-url> [output-path]
 *
 * Prerequisites:
 *   - Azure CLI installed (`winget install Microsoft.AzureCLI`)
 *   - Signed in via `az login` (one-time; uses WAM broker on Windows)
 *
 * Auth note:
 *   Microsoft tenant has Conditional Access policies requiring token protection.
 *   This blocks most SDK-based auth flows (@azure/identity, device code, etc.).
 *   Azure CLI's WAM broker satisfies these policies — it's the only reliable path.
 *
 * Output: Prints the local file path to stdout on success.
 *         Diagnostic messages go to stderr.
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const url = process.argv[2];
const outputPath = process.argv[3];

if (!url) {
  console.error('Usage: node download-sharepoint.js <sharepoint-url> [output-path]');
  console.error('');
  console.error('Downloads a SharePoint file to a local path using Microsoft Graph API.');
  console.error('Requires: az login (Azure CLI with WAM authentication)');
  console.error('Prints the output file path to stdout on success.');
  process.exit(1);
}

/**
 * Encode a sharing URL for the Graph /shares endpoint.
 * See: https://learn.microsoft.com/en-us/graph/api/shares-get
 */
function encodeSharingUrl(sharingUrl) {
  const base64 = Buffer.from(sharingUrl, 'utf-8').toString('base64');
  return 'u!' + base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Get a Graph API access token via Azure CLI.
 * Uses WAM (Web Account Manager) on Windows — satisfies token protection CA policies.
 */
function getGraphToken() {
  try {
    const result = execSync(
      'az account get-access-token --resource https://graph.microsoft.com --query accessToken -o tsv',
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    return result.trim();
  } catch (err) {
    const msg = err.stderr || err.message || '';
    if (msg.includes('not recognized') || msg.includes('not found')) {
      console.error('Azure CLI not found. Install with: winget install Microsoft.AzureCLI');
    } else if (msg.includes('az login') || msg.includes('Please run')) {
      console.error('Not signed in. Run: az login');
    } else {
      console.error('Failed to get token from Azure CLI:');
      console.error(msg);
    }
    process.exit(1);
  }
}

async function main() {
  // 1. Get token via Azure CLI
  console.error('Getting token from Azure CLI...');
  const token = getGraphToken();

  // 2. Resolve the sharing URL to a driveItem
  const shareId = encodeSharingUrl(url);
  const graphUrl = `https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem`;

  console.error('Resolving SharePoint URL...');
  const itemRes = await fetch(graphUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!itemRes.ok) {
    const body = await itemRes.text();
    console.error(`Graph API error ${itemRes.status}: ${itemRes.statusText}`);
    console.error(body);
    process.exit(1);
  }

  const driveItem = await itemRes.json();
  const fileName = driveItem.name;
  const downloadUrl = driveItem['@microsoft.graph.downloadUrl'];

  if (!downloadUrl) {
    console.error('No download URL returned by Graph API.');
    console.error('The file may require additional permissions.');
    process.exit(1);
  }

  // 3. Download the file content
  console.error(`Downloading: ${fileName} (${formatBytes(driveItem.size)})...`);
  const fileRes = await fetch(downloadUrl);

  if (!fileRes.ok) {
    console.error(`Download failed: ${fileRes.status} ${fileRes.statusText}`);
    process.exit(1);
  }

  const buffer = Buffer.from(await fileRes.arrayBuffer());
  const outPath = outputPath || join(tmpdir(), fileName);
  writeFileSync(outPath, buffer);

  // Print path to stdout (for piping); diagnostics go to stderr
  console.log(outPath);
  console.error(`Done. Saved to: ${outPath}`);
}

function formatBytes(bytes) {
  if (!bytes) return 'unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
