/**
 * ADO Work Item Sync
 * Syncs work items from Azure DevOps into project manifests based on tags
 * 
 * Usage: 
 *   node sync-ado.js                    # Sync all projects
 *   node sync-ado.js "Project Name"     # Sync specific project
 * 
 * Requires: ADO MCP server configured in VS Code
 * 
 * How it works:
 * 1. Reads project manifest.yaml
 * 2. Looks for ado.tag field (e.g., "UIM")
 * 3. Queries ADO for work items with that tag
 * 4. Updates manifest with current work items
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_DIR = join(__dirname, '..');

// This script generates a report that you paste to Copilot
// Copilot will then run the ADO query and update the manifest

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
      
      if (manifest.ado?.tag) {
        projects.push({
          name: manifest.project?.name || entry.name,
          folder: entry.name,
          manifestPath,
          tag: manifest.ado.tag,
          organization: manifest.ado.organization || 'msazure',
          project: manifest.ado.project || 'One',
          areaPath: manifest.ado.area_path
        });
      }
    } catch (e) {
      console.error(`Error loading ${entry.name}:`, e.message);
    }
  }
  
  return projects;
}

// Main
const targetProject = process.argv[2];

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                 🔄 ADO SYNC HELPER                           ║
╚══════════════════════════════════════════════════════════════╝
`);

const projects = loadProjects();
const filtered = targetProject 
  ? projects.filter(p => p.name.toLowerCase().includes(targetProject.toLowerCase()))
  : projects;

if (filtered.length === 0) {
  console.log('No projects found with ADO tags configured.');
  console.log('Add "ado.tag" to your manifest.yaml files.');
  process.exit(0);
}

console.log('Projects with ADO tags:\n');

for (const p of filtered) {
  console.log(`📁 ${p.name}`);
  console.log(`   Tag: ${p.tag}`);
  console.log(`   Area: ${p.areaPath || 'Not specified'}`);
  console.log();
}

console.log('─'.repeat(60));
console.log(`
To sync these projects, ask Copilot:

  "Search ADO for work items with tag '${filtered[0]?.tag}' and update the manifest"

Or for all projects:

  "Sync my ADO work items for all projects"

Copilot will:
1. Query ADO for work items matching each project's tag
2. Update the manifest.yaml with current epics, features, etc.
3. Report what was synced
`);
