#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const readline = require('readline');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const paths = {
  setupTemplate: path.join(repoRoot, 'setup.yaml.template'),
  setup: path.join(repoRoot, 'setup.yaml'),
  mcpTemplate: path.join(repoRoot, 'mcp.json.template'),
  mcp: path.join(repoRoot, 'mcp.json'),
  vscodeDir: path.join(repoRoot, '.vscode'),
  vscodeMcp: path.join(repoRoot, '.vscode', 'mcp.json'),
  teamKnowledgeDir: path.join(repoRoot, 'team-knowledge'),
  teamKnowledgeConfig: path.join(repoRoot, 'team-knowledge', 'config.yaml'),
  productContextDir: path.join(repoRoot, 'team-knowledge', 'product-context'),
  writingStylesDir: path.join(repoRoot, 'team-knowledge', 'writing-styles'),
  writingStyleGuide: path.join(repoRoot, 'team-knowledge', 'writing-style-guide.md'),
  productContextReadme: path.join(repoRoot, 'team-knowledge', 'product-context', 'README.md'),
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function yamlString(value) {
  return JSON.stringify(value ?? '');
}

function normalizeAreaPath(value) {
  return (value || '').trim().replace(/\\+/g, '\\');
}

function question(rl, prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function ask(rl, prompt, defaultValue = '') {
  const answer = await question(rl, `${prompt} `);
  const trimmed = answer.trim();
  return trimmed === '' ? defaultValue : trimmed;
}

async function confirmOverwrite(rl) {
  console.log('⚠️  setup.yaml already exists.');
  const answer = await question(rl, 'Overwrite existing setup.yaml? [y/N]: ');
  return ['y', 'yes'].includes(answer.trim().toLowerCase());
}

function parseYamlScalar(rawValue) {
  const trimmed = rawValue.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    if (trimmed.startsWith('"')) {
      return JSON.parse(trimmed);
    }
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }

  return trimmed;
}

function extractKnowledgeFiles(setupYamlText) {
  const lines = setupYamlText.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.trim().startsWith('knowledge_files:'));

  if (startIndex === -1) {
    return [];
  }

  if (lines[startIndex].includes('[]')) {
    return [];
  }

  const files = [];
  let current = null;

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      break;
    }

    const localMatch = trimmed.match(/^-\s+local:\s+(.+)$/);
    if (localMatch) {
      current = { local: parseYamlScalar(localMatch[1]), remote: '', description: '' };
      files.push(current);
      continue;
    }

    if (!current) {
      continue;
    }

    const remoteMatch = trimmed.match(/^remote:\s+(.+)$/);
    if (remoteMatch) {
      current.remote = parseYamlScalar(remoteMatch[1]);
      continue;
    }

    const descriptionMatch = trimmed.match(/^description:\s+(.+)$/);
    if (descriptionMatch) {
      current.description = parseYamlScalar(descriptionMatch[1]);
    }
  }

  return files.filter((entry) => entry.local && entry.remote);
}

function renderKnowledgeFiles(entries) {
  if (!entries.length) {
    return [
      'knowledge_files: []',
      '  # Example:',
      '  # - local: "domain-model.md"',
      '  #   remote: "domain-model.md"',
      '  #   description: "Team domain reference"',
      '  # - local: "product-context/vision.md"',
      '  #   remote: "product-context/vision.md"',
      '  #   description: "Product vision doc"',
    ].join('\n');
  }

  const lines = ['knowledge_files:'];

  for (const entry of entries) {
    lines.push(`  - local: ${yamlString(entry.local)}`);
    lines.push(`    remote: ${yamlString(entry.remote)}`);
    if (entry.description) {
      lines.push(`    description: ${yamlString(entry.description)}`);
    }
  }

  return lines.join('\n');
}

function buildSetupYaml(config) {
  return `# PM Agent Pack — Setup Configuration
# Copy this file to setup.yaml and fill in your team's values.
# Then run: node tools/setup.js
#
# setup.yaml is gitignored — it contains your personal/team configuration.

# Your team identity
team:
  name: ${yamlString(config.team.name)}              # e.g., "Brain/AIOps", "Azure Compute", "Teams Platform"
  short_name: ${yamlString(config.team.shortName)}        # e.g., "Brain", "Compute", "Teams" — used in casual references

# Azure DevOps configuration
ado:
  organization: ${yamlString(config.ado.organization)}      # e.g., "msazure"
  project: ${yamlString(config.ado.project)}           # e.g., "One"
  area_path: ${yamlString(config.ado.areaPath)}         # e.g., "Azure Edge and Platform\\Health and Standards\\AIOps"

# SharePoint — where your team's knowledge docs live (optional)
sharepoint:
  site: ${yamlString(config.sharepoint.site)}              # e.g., "https://microsoft.sharepoint.com/teams/YourTeam"
  folder: ${yamlString(config.sharepoint.folder)}            # e.g., "/Shared Documents/General/PM Specs/Team Knowledge"

# Knowledge files to sync from SharePoint (optional)
# Each entry maps a local path (relative to team-knowledge/) to its SharePoint source.
# If the remote file is .docx but local is .md, the tool auto-converts.
${renderKnowledgeFiles(config.knowledgeFiles)}

# GitHub repository for this agent pack (optional)
github:
  owner: ${yamlString(config.github.owner)}             # e.g., "mhetrick_microsoft"
  repo: ${yamlString(config.github.repo)}              # e.g., "automations"
`;
}

function buildTeamKnowledgeConfig(config) {
  const lines = [
    '# Team Knowledge Sync Configuration',
    '# Generated by tools/setup.js. Update files: entries as your knowledge base grows.',
    '',
    'sharepoint:',
    `  site: ${yamlString(config.sharepoint.site)}`,
    `  folder: ${yamlString(config.sharepoint.folder)}`,
    '',
    '# Each entry maps a local path (relative to team-knowledge/) to its SharePoint source.',
    '# If the remote file is .docx but local is .md, the tool auto-converts using read-doc.js.',
  ];

  if (config.knowledgeFiles.length === 0) {
    lines.push('files: []');
  } else {
    lines.push('files:');
    for (const entry of config.knowledgeFiles) {
      lines.push(`  - local: ${yamlString(entry.local)}`);
      lines.push(`    remote: ${yamlString(entry.remote)}`);
      if (entry.description) {
        lines.push(`    description: ${yamlString(entry.description)}`);
      }
    }
  }

  lines.push(
    '',
    'conversion:',
    '  auto_convert: true',
    '  converter: "read-doc.js"',
    ''
  );

  return lines.join('\n');
}

function buildMcpConfig(config) {
  const template = JSON.parse(fs.readFileSync(paths.mcpTemplate, 'utf8'));
  const adoArgs = template?.servers?.ado?.args;

  if (!Array.isArray(adoArgs)) {
    throw new Error('mcp.json.template does not contain servers.ado.args');
  }

  template.servers.ado.args = adoArgs.map((arg) => {
    if (arg === '${input:ado_org}') {
      return '${input:ado_org = ' + config.ado.organization + '}';
    }
    if (arg === '<YOUR_PROJECT>') {
      return config.ado.project;
    }
    if (arg === '<YOUR_AREA_PATH>') {
      return config.ado.areaPath;
    }
    return arg;
  });

  if (Array.isArray(template.inputs)) {
    template.inputs = template.inputs.map((input) => {
      if (input.id === 'ado_org') {
        return {
          ...input,
          description: `Azure DevOps organization name (e.g. '${config.ado.organization}')`,
        };
      }
      return input;
    });
  }

  return `${JSON.stringify(template, null, 2)}\n`;
}

function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    return;
  }

  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function createPlaceholders() {
  ensureDir(paths.teamKnowledgeDir);
  ensureDir(paths.productContextDir);
  ensureDir(paths.writingStylesDir);

  writeIfMissing(
    paths.writingStyleGuide,
    `# Writing Style Guide\n\nCapture your team's shared writing conventions here. Useful sections to add:\n\n- Preferred tone and level of formality\n- Standard document structure and headings\n- Terminology to use consistently\n- Terms or phrases to avoid\n- Example snippets that reflect the team's voice\n`
  );

  writeIfMissing(
    paths.productContextReadme,
    `# Product Context\n\nStore durable product context here so every agent can load it automatically. Good starting points:\n\n- Vision and strategy docs\n- Roadmap or priority summaries\n- Customer problem statements\n- Domain model and key terminology\n- Architecture or dependency overviews relevant to PM work\n`
  );
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    if (!fs.existsSync(paths.setupTemplate)) {
      throw new Error(`Missing template: ${paths.setupTemplate}`);
    }

    if (!fs.existsSync(paths.mcpTemplate)) {
      throw new Error(`Missing MCP template: ${paths.mcpTemplate}`);
    }

    let knowledgeFiles = [];

    if (fs.existsSync(paths.setup)) {
      knowledgeFiles = extractKnowledgeFiles(fs.readFileSync(paths.setup, 'utf8'));
      const overwrite = await confirmOverwrite(rl);
      if (!overwrite) {
        console.log('Setup cancelled. Existing setup.yaml was left unchanged.');
        return;
      }
    }

    fs.copyFileSync(paths.setupTemplate, paths.setup);

    const teamName = await ask(rl, 'What is your team name? [e.g., Brain/AIOps]:', '');
    const shortName = await ask(rl, 'Short name for casual references? [e.g., Brain]:', '');
    const adoOrganization = await ask(rl, 'Azure DevOps organization? [msazure]:', 'msazure');
    const adoProject = await ask(rl, 'Azure DevOps project? [One]:', 'One');
    const adoAreaPathInput = await ask(rl, 'Area path (use \\\\ for separators)? []:', '');
    const sharePointSite = await ask(rl, 'SharePoint site URL (or press Enter to skip)? []:', '');
    const sharePointFolder = await ask(rl, 'Knowledge docs folder path? []:', '');
    const githubOwner = await ask(rl, 'GitHub owner (or press Enter to skip)? []:', '');
    const githubRepo = await ask(rl, 'GitHub repo name? []:', '');

    const config = {
      team: {
        name: teamName,
        shortName,
      },
      ado: {
        organization: adoOrganization,
        project: adoProject,
        areaPath: normalizeAreaPath(adoAreaPathInput),
      },
      sharepoint: {
        site: sharePointSite,
        folder: sharePointFolder,
      },
      knowledgeFiles,
      github: {
        owner: githubOwner,
        repo: githubRepo,
      },
    };

    fs.writeFileSync(paths.setup, buildSetupYaml(config), 'utf8');

    const mcpConfig = buildMcpConfig(config);
    fs.writeFileSync(paths.mcp, mcpConfig, 'utf8');
    ensureDir(paths.vscodeDir);
    fs.writeFileSync(paths.vscodeMcp, mcpConfig, 'utf8');

    ensureDir(paths.teamKnowledgeDir);
    fs.writeFileSync(paths.teamKnowledgeConfig, buildTeamKnowledgeConfig(config), 'utf8');

    createPlaceholders();

    const sharePointSummary = config.sharepoint.site || 'not configured';
    const areaSummary = config.ado.areaPath || 'not configured';

    console.log('✅ Setup complete!');
    console.log('');
    console.log('Your configuration:');
    console.log(`  Team: ${config.team.name || '(not set)'}`);
    console.log(`  ADO: ${config.ado.organization}/${config.ado.project} — ${areaSummary}`);
    console.log(`  SharePoint: ${sharePointSummary}`);
    console.log('');
    console.log('Next steps:');
    console.log("1. Add your team's domain model to team-knowledge/ (e.g., domain-model.md)");
    console.log('2. Add product context docs to team-knowledge/product-context/');
    console.log('3. If SharePoint is configured, run: node tools/fetch-knowledge.js --pull');
    console.log('4. Start using agents: @pm-lead-agent in VS Code Copilot Chat');
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(`❌ Setup failed: ${error.message}`);
  process.exitCode = 1;
});
