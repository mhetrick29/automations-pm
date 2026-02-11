#!/usr/bin/env node
/**
 * End of Day Automation
 * 
 * Uses Microsoft Work IQ via MCP protocol to gather emails, Teams messages, 
 * and meetings for each project, then generates a daily markdown summary.
 * 
 * Usage:
 *   node end-of-day.js                    # Run for today
 *   node end-of-day.js 2026-01-26         # Run for specific date
 *   node end-of-day.js --dry-run          # Preview without saving files
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECTS_DIR = path.join(__dirname, '..');
const DATE_ARG = process.argv.find(arg => /^\d{4}-\d{2}-\d{2}$/.test(arg));
const DRY_RUN = process.argv.includes('--dry-run');

// Get target date
function getTargetDate() {
    if (DATE_ARG) return DATE_ARG;
    return new Date().toISOString().split('T')[0];
}

// Find all project manifests
function findProjects() {
    const projects = [];
    const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
    
    for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('_')) {
            const manifestPath = path.join(PROJECTS_DIR, entry.name, 'manifest.yaml');
            if (fs.existsSync(manifestPath)) {
                try {
                    const manifest = yaml.load(fs.readFileSync(manifestPath, 'utf8'));
                    projects.push({
                        name: manifest.project?.name || entry.name,
                        folder: entry.name,
                        path: path.join(PROJECTS_DIR, entry.name),
                        adoTag: manifest.ado?.tag || null,
                        adoAreaPath: manifest.ado?.area_path || null
                    });
                } catch (err) {
                    console.error(`Error reading manifest for ${entry.name}:`, err.message);
                }
            }
        }
    }
    return projects;
}

// Create MCP client connected to Work IQ
async function createWorkIQClient() {
    const transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@microsoft/workiq', 'mcp']
    });
    
    const client = new Client({
        name: 'end-of-day-automation',
        version: '1.0.0'
    }, {
        capabilities: {}
    });
    
    await client.connect(transport);
    return client;
}

// Query Work IQ via MCP
async function queryWorkIQ(client, prompt) {
    try {
        const result = await client.callTool({
            name: 'ask_work_iq',
            arguments: { question: prompt }
        }, undefined, {
            timeout: 300000  // 5 minute timeout
        });
        
        if (result.content && result.content.length > 0) {
            const text = result.content
                .filter(c => c.type === 'text')
                .map(c => c.text)
                .join('\n');
            return text;
        }
        return null;
    } catch (err) {
        console.error(`    ❌ Query failed: ${err.message}`);
        return null;
    }
}

// Generate daily summary for a project (split into 3 queries)
async function generateProjectSummary(client, project, date) {
    console.log(`\n📁 Processing: ${project.name}`);
    
    const sections = [];
    
    // Query 1: Teams & Meetings
    console.log(`  🗨️  Querying Teams & Meetings...`);
    const teamsPrompt = `Summarize all Teams activity about ${project.name} from ${date}: meetings I attended, team channel discussions, chat messages, decisions made, action items. Output as markdown only.`;
    const teamsResult = await queryWorkIQ(client, teamsPrompt);
    if (teamsResult) {
        console.log(`    ✅ Got ${teamsResult.length} chars`);
        sections.push(`## Teams & Meetings\n\n${teamsResult}`);
    }
    
    // Query 2: Emails
    console.log(`  📧 Querying Emails...`);
    const emailsPrompt = `Summarize all emails about ${project.name} from ${date}: key threads, conclusions, action items, announcements. Output as markdown only.`;
    const emailsResult = await queryWorkIQ(client, emailsPrompt);
    if (emailsResult) {
        console.log(`    ✅ Got ${emailsResult.length} chars`);
        sections.push(`## Emails\n\n${emailsResult}`);
    }
    
    // Query 3: Documents
    console.log(`  📄 Querying Documents...`);
    const docsPrompt = `Summarize documents about ${project.name} I edited on ${date}: .docx, .pptx, .pptm, .xlsx files and key changes. Output as markdown only.`;
    const docsResult = await queryWorkIQ(client, docsPrompt);
    if (docsResult) {
        console.log(`    ✅ Got ${docsResult.length} chars`);
        sections.push(`## Documents\n\n${docsResult}`);
    }
    
    // Combine all sections
    if (sections.length === 0) {
        return `# ${project.name} - Daily Summary for ${date}\n\n_No Work IQ data available_\n`;
    }
    
    const header = `# ${project.name} - Daily Summary for ${date}\n\n`;
    return header + sections.join('\n\n---\n\n');
}

// Save daily summary
function saveSummary(project, date, content) {
    const dailyDir = path.join(project.path, 'daily');
    
    if (!fs.existsSync(dailyDir)) {
        fs.mkdirSync(dailyDir, { recursive: true });
    }
    
    const filepath = path.join(dailyDir, `${date}.md`);
    
    if (DRY_RUN) {
        console.log(`  📝 [DRY RUN] Would save to: ${filepath}`);
        console.log('\n--- Preview ---');
        console.log(content.substring(0, 1500));
        console.log('--- End Preview ---\n');
        return filepath;
    }
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`  ✅ Saved: ${filepath}`);
    return filepath;
}

// Main
async function main() {
    const date = getTargetDate();
    console.log(`\n🌙 End of Day Automation`);
    console.log(`📅 Date: ${date}`);
    if (DRY_RUN) console.log(`⚠️  DRY RUN MODE\n`);
    
    const projects = findProjects();
    console.log(`Found ${projects.length} project(s):`);
    projects.forEach(p => console.log(`  • ${p.name}${p.adoTag ? ` [ADO: ${p.adoTag}]` : ''}`));
    
    // Connect to Work IQ
    console.log('\n🔌 Connecting to Work IQ...');
    const client = await createWorkIQClient();
    console.log('✅ Connected!\n');
    
    try {
        for (const project of projects) {
            const content = await generateProjectSummary(client, project, date);
            saveSummary(project, date, content);
        }
    } finally {
        await client.close();
    }
    
    // Remind about ADO sync
    const adoProjects = projects.filter(p => p.adoTag);
    if (adoProjects.length > 0) {
        console.log('\n📋 ADO Sync Reminder:');
        console.log('   Run /sync-ado or ask Copilot to sync ADO work items');
        console.log(`   Projects with ADO tags: ${adoProjects.map(p => p.adoTag).join(', ')}`);
    }
    
    console.log('\n✨ Done!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
