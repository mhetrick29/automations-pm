#!/usr/bin/env node
/**
 * Classify Documents (Work IQ Edition)
 * 
 * Uses Work IQ to find documents edited/created today, then:
 * - OneDrive docs: Add link to appropriate project manifest
 * - SharePoint/external docs: Add link to project manifest
 * 
 * Usage:
 *   node classify-docs.js                 # Run for today
 *   node classify-docs.js 2026-01-26      # Run for specific date
 *   node classify-docs.js --dry-run       # Preview without changes
 * 
 * Environment variables:
 *   PROJECTS_DIR — Path to projects folder (default: ~/OneDrive - Microsoft/Projects)
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration — paths are configurable
const DEFAULT_PROJECTS_DIR = path.join(os.homedir(), 'OneDrive - Microsoft', 'Projects');
const PROJECTS_DIR = process.env.PROJECTS_DIR || DEFAULT_PROJECTS_DIR;
const NEEDS_SORTING = path.join(PROJECTS_DIR, '_needs-sorting');
const DATE_ARG = process.argv.find(arg => /^\d{4}-\d{2}-\d{2}$/.test(arg));
const DRY_RUN = process.argv.includes('--dry-run');

function getTargetDate() {
    if (DATE_ARG) return DATE_ARG;
    return new Date().toISOString().split('T')[0];
}

function loadProjects() {
    const projects = [];

    if (!fs.existsSync(PROJECTS_DIR)) {
        console.error(`❌ Projects directory not found: ${PROJECTS_DIR}`);
        console.error(`   Set PROJECTS_DIR environment variable or ensure the default path exists.`);
        process.exit(1);
    }

    const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
    
    for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('_')) continue;
        
        const manifestPath = path.join(PROJECTS_DIR, entry.name, 'manifest.yaml');
        if (!fs.existsSync(manifestPath)) continue;
        
        try {
            const content = fs.readFileSync(manifestPath, 'utf-8');
            const manifest = yaml.load(content);
            
            projects.push({
                name: manifest.project?.name || entry.name,
                folder: entry.name,
                path: path.join(PROJECTS_DIR, entry.name),
                manifestPath,
                manifest
            });
        } catch (e) {
            console.error(`  ⚠️ Failed to load manifest for ${entry.name}`);
        }
    }
    
    return projects;
}

async function createWorkIQClient() {
    const transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@microsoft/workiq', 'mcp']
    });
    
    const client = new Client({
        name: 'classify-docs',
        version: '1.0.0'
    }, {
        capabilities: {}
    });
    
    await client.connect(transport);
    return client;
}

async function queryWorkIQ(client, prompt) {
    try {
        const result = await client.callTool({
            name: 'ask_work_iq',
            arguments: { question: prompt }
        }, undefined, {
            timeout: 300000
        });
        
        if (result.content && result.content.length > 0) {
            return result.content
                .filter(c => c.type === 'text')
                .map(c => c.text)
                .join('\n');
        }
        return null;
    } catch (err) {
        console.error(`  ❌ Work IQ query failed: ${err.message}`);
        return null;
    }
}

async function getEditedDocs(client, date) {
    console.log(`\n📄 Finding documents edited on ${date}...`);
    
    const prompt = `List all Word, PowerPoint, and Excel documents I edited or created on ${date}. Include docs from my OneDrive, other OneDrives, and any SharePoint sites. For each document provide: filename, location (OneDrive or SharePoint name), URL, and a brief description. Format as: FILENAME | LOCATION | URL | DESCRIPTION`;

    const result = await queryWorkIQ(client, prompt);
    return result;
}

async function classifyDoc(client, docName, docDescription, projects) {
    const projectNames = projects.map(p => p.name).join(', ');
    
    const prompt = `Given this document:
Name: ${docName}
Description: ${docDescription}

Which of these projects does it belong to?
${projectNames}

Reply with ONLY the project name, or "UNKNOWN" if it doesn't match any project.`;

    const result = await queryWorkIQ(client, prompt);
    if (!result) return null;
    
    const cleanResult = result.trim().replace(/['"]/g, '');
    const matchedProject = projects.find(p => 
        p.name.toLowerCase() === cleanResult.toLowerCase() ||
        cleanResult.toLowerCase().includes(p.name.toLowerCase())
    );
    
    return matchedProject || null;
}

function addLinkToManifest(project, docName, url, description) {
    const manifest = project.manifest;
    
    if (!manifest.links) manifest.links = [];
    
    const existingLink = manifest.links.find(l => l.url === url);
    if (existingLink) {
        console.log(`    ℹ️ Link already exists in manifest`);
        return false;
    }
    
    manifest.links.push({
        name: docName,
        url: url,
        description: description,
        added: new Date().toISOString().split('T')[0]
    });
    
    if (DRY_RUN) {
        console.log(`    📝 [DRY RUN] Would add link to manifest`);
        return false;
    }
    
    const yamlContent = yaml.dump(manifest, { 
        lineWidth: -1,
        quotingType: '"',
        forceQuotes: false
    });
    fs.writeFileSync(project.manifestPath, yamlContent, 'utf-8');
    console.log(`    ✅ Added link to ${project.folder}/manifest.yaml`);
    return true;
}

function parseDocList(docListText) {
    const docs = [];
    
    const urlPattern = /\[(\d+)\]\((https:\/\/[^\)]+)\)/g;
    const citedUrls = {};
    let match;
    while ((match = urlPattern.exec(docListText)) !== null) {
        citedUrls[match[1]] = match[2];
    }
    
    const lines = docListText.split('\n').filter(l => l.includes('|') && l.includes('.'));
    
    for (const line of lines) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 4) {
            let url = parts[2];
            
            if (url.toLowerCase().includes('not returned') || !url.startsWith('http')) {
                const citationMatch = parts[3].match(/\[(\d+)\]/);
                if (citationMatch && citedUrls[citationMatch[1]]) {
                    url = citedUrls[citationMatch[1]];
                }
            }
            
            const isOneDrive = url.includes('personal/') || url.includes('-my.sharepoint');
            const location = isOneDrive ? 'OneDrive' : (parts[1].includes('not returned') ? 'SharePoint' : parts[1]);
            
            docs.push({
                filename: parts[0].replace(/^\*\*|\*\*$/g, ''),
                location: location,
                url: url,
                description: parts[3].replace(/\[\d+\]\([^\)]+\)/g, '').trim()
            });
        }
    }
    
    return docs;
}

async function main() {
    const date = getTargetDate();
    
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║              📋 CLASSIFY DOCS (Work IQ Edition)              ║
╚══════════════════════════════════════════════════════════════╝

📅 Date: ${date}
📂 Projects: ${PROJECTS_DIR}
${DRY_RUN ? '⚠️  DRY RUN MODE - No changes will be made\n' : ''}`);

    const projects = loadProjects();
    console.log(`Found ${projects.length} project(s):`);
    projects.forEach(p => console.log(`  • ${p.name}`));
    
    console.log('\n🔌 Connecting to Work IQ...');
    const client = await createWorkIQClient();
    console.log('✅ Connected!');
    
    try {
        const docListText = await getEditedDocs(client, date);
        
        if (!docListText) {
            console.log('\n❌ Failed to get document list from Work IQ');
            return;
        }
        
        console.log('\n📋 Work IQ Response:');
        console.log(docListText);
        
        const docs = parseDocList(docListText);
        console.log(`\n📊 Found ${docs.length} document(s) to classify`);
        
        let oneDriveCount = 0;
        let externalCount = 0;
        let classifiedCount = 0;
        let unknownDocs = [];
        
        for (const doc of docs) {
            console.log(`\n📄 ${doc.filename}`);
            console.log(`   📍 ${doc.location}`);
            
            const project = await classifyDoc(client, doc.filename, doc.description, projects);
            
            if (!project) {
                console.log(`   ❓ Could not classify - adding to _needs-sorting`);
                unknownDocs.push(doc);
                continue;
            }
            
            console.log(`   🎯 Classified to: ${project.name}`);
            classifiedCount++;
            
            const isOneDrive = doc.location.toLowerCase().includes('onedrive');
            
            if (isOneDrive) {
                oneDriveCount++;
                console.log(`   📁 OneDrive doc - adding link to manifest`);
            } else {
                externalCount++;
                console.log(`   🔗 External doc - adding link to manifest`);
            }
            addLinkToManifest(project, doc.filename, doc.url, doc.description);
        }
        
        if (unknownDocs.length > 0) {
            console.log(`\n📁 Documents that couldn't be classified:`);
            for (const doc of unknownDocs) {
                console.log(`   • ${doc.filename} (${doc.location})`);
            }
            
            const needsSortingManifest = path.join(NEEDS_SORTING, 'manifest.yaml');
            if (!fs.existsSync(NEEDS_SORTING)) {
                fs.mkdirSync(NEEDS_SORTING, { recursive: true });
            }
            
            let sortingManifest = { links: [] };
            if (fs.existsSync(needsSortingManifest)) {
                sortingManifest = yaml.load(fs.readFileSync(needsSortingManifest, 'utf-8')) || { links: [] };
            }
            
            if (!sortingManifest.links) sortingManifest.links = [];
            
            for (const doc of unknownDocs) {
                if (!sortingManifest.links.find(l => l.url === doc.url)) {
                    sortingManifest.links.push({
                        name: doc.filename,
                        url: doc.url,
                        description: doc.description,
                        location: doc.location,
                        added: date
                    });
                }
            }
            
            if (!DRY_RUN) {
                fs.writeFileSync(needsSortingManifest, yaml.dump(sortingManifest), 'utf-8');
                console.log(`\n   ✅ Added ${unknownDocs.length} doc(s) to _needs-sorting/manifest.yaml`);
            } else {
                console.log(`\n   📝 [DRY RUN] Would add ${unknownDocs.length} doc(s) to _needs-sorting`);
            }
        }
        
        console.log(`
╔══════════════════════════════════════════════════════════════╗
║                        📊 SUMMARY                            ║
╚══════════════════════════════════════════════════════════════╝
   Documents found:     ${docs.length}
   Classified:          ${classifiedCount}
   OneDrive docs:       ${oneDriveCount}
   External docs:       ${externalCount}
   Needs sorting:       ${unknownDocs.length}
`);
        
    } finally {
        await client.close();
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
