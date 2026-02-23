#!/usr/bin/env node
/**
 * Daily Action Items Automation
 * 
 * Uses Microsoft Work IQ via MCP protocol to gather action items from
 * Teams chats, meetings, and Outlook emails for the day.
 * 
 * Appends new items to a tracker file for tracking over time.
 * 
 * Usage:
 *   node action-items.js                    # Run for today
 *   node action-items.js 2026-01-26         # Run for specific date
 *   node action-items.js --days 7           # Look back 7 days
 *   node action-items.js --no-append        # Don't append to tracker file
 *   node action-items.js --tracker ~/path   # Custom tracker file path
 *   node action-items.js --output ~/path    # Custom output directory
 * 
 * Environment variables:
 *   PROJECTS_DIR — Path to projects folder (default: ~/OneDrive - Microsoft/Projects)
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration — paths are configurable via env vars or CLI args
const DEFAULT_PROJECTS_DIR = path.join(os.homedir(), 'OneDrive - Microsoft', 'Projects');
const PROJECTS_DIR = process.env.PROJECTS_DIR || DEFAULT_PROJECTS_DIR;
const TRACKER_ARG = process.argv.find((arg, i, arr) => arr[i - 1] === '--tracker');
const TRACKER_FILE = TRACKER_ARG || path.join(PROJECTS_DIR, '_automation', 'task-tracker.md');
const AGENT_DIR = path.join(__dirname, '..', 'agents', 'action-items');
const PROMPTS_FILE = path.join(AGENT_DIR, 'get-action-items.md');
const DATE_ARG = process.argv.find(arg => /^\d{4}-\d{2}-\d{2}$/.test(arg));
const NO_APPEND = process.argv.includes('--no-append');
const DAYS_ARG = process.argv.find((arg, i, arr) => arr[i - 1] === '--days');
const LOOKBACK_DAYS = DAYS_ARG ? parseInt(DAYS_ARG, 10) : 1;
const OUTPUT_ARG = process.argv.find((arg, i, arr) => arr[i - 1] === '--output');
const OUTPUT_DIR = OUTPUT_ARG || path.join(PROJECTS_DIR, '_automation', 'output');

// Load prompts from agent's get-action-items.md file
function loadPrompts() {
    if (!fs.existsSync(PROMPTS_FILE)) {
        console.error(`❌ Prompts file not found: ${PROMPTS_FILE}`);
        process.exit(1);
    }
    
    const content = fs.readFileSync(PROMPTS_FILE, 'utf8');
    const prompts = {};
    
    const sections = content.split(/\r?\n---\r?\n/);
    for (const section of sections) {
        const match = section.match(/## (\w+)\s*\r?\n\r?\n?([\s\S]+)/);
        if (match) {
            const name = match[1].trim();
            const prompt = match[2].trim();
            prompts[name] = prompt;
        }
    }
    
    return prompts;
}

// Get target date range (uses local timezone)
function getDateRange() {
    const endDate = DATE_ARG ? new Date(DATE_ARG + 'T00:00:00') : new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (LOOKBACK_DAYS - 1));
    
    const formatLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    return {
        start: formatLocal(startDate),
        end: formatLocal(endDate)
    };
}

// Create MCP client connected to Work IQ
async function createWorkIQClient() {
    const transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@microsoft/workiq', 'mcp']
    });
    
    const client = new Client({
        name: 'action-items-automation',
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
            timeout: 300000
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

// Generate action items from all sources
async function gatherActionItems(client, dateRange, prompts) {
    const dateDescription = dateRange.start === dateRange.end 
        ? `on ${dateRange.end}` 
        : `from ${dateRange.start} to ${dateRange.end}`;
    
    console.log(`\n📋 Gathering action items ${dateDescription}...\n`);
    
    const allItems = [];
    const fillPrompt = (template) => template.replace(/\{\{dateDescription\}\}/g, dateDescription);
    
    if (prompts.meetings) {
        console.log(`  📅 Checking Teams Meetings...`);
        const meetingsResult = await queryWorkIQ(client, fillPrompt(prompts.meetings));
        if (meetingsResult) {
            const items = parseWorkIQItems(meetingsResult, '📅 Meeting', dateRange.end);
            console.log(items.length > 0 ? `    ✅ Found ${items.length} meeting action items` : `    ℹ️  No meeting action items found`);
            allItems.push(...items);
        }
    }
    
    if (prompts.chats) {
        console.log(`  💬 Checking Teams Chats...`);
        const chatsResult = await queryWorkIQ(client, fillPrompt(prompts.chats));
        if (chatsResult) {
            const items = parseWorkIQItems(chatsResult, '💬 Chat', dateRange.end);
            console.log(items.length > 0 ? `    ✅ Found ${items.length} chat action items` : `    ℹ️  No chat action items found`);
            allItems.push(...items);
        }
    }
    
    if (prompts.emails) {
        console.log(`  📧 Checking Outlook Emails...`);
        const emailsResult = await queryWorkIQ(client, fillPrompt(prompts.emails));
        if (emailsResult) {
            const items = parseWorkIQItems(emailsResult, '📧 Email', dateRange.end);
            console.log(items.length > 0 ? `    ✅ Found ${items.length} email action items` : `    ℹ️  No email action items found`);
            allItems.push(...items);
        }
    }
    
    if (prompts.calendar) {
        console.log(`  🗓️  Checking upcoming meetings to prepare for...`);
        const calendarResult = await queryWorkIQ(client, fillPrompt(prompts.calendar));
        if (calendarResult) {
            const items = parseWorkIQItems(calendarResult, '🗓️ Prep', dateRange.end);
            console.log(items.length > 0 ? `    ✅ Found ${items.length} prep items` : `    ℹ️  No meeting prep items found`);
            allItems.push(...items);
        }
    }
    
    return allItems;
}

// Parse Work IQ JSON response into structured items
function parseWorkIQItems(response, source, dateAdded) {
    try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return [];
        
        const items = JSON.parse(jsonMatch[0]);
        return items.map(item => ({
            done: false,
            dateAdded,
            source,
            item: (item.item || item.action || item.task || '').replace(/\|/g, '-').replace(/\n/g, ' ').trim(),
            from: (item.from || item.sender || item.assignedBy || 'Unknown').replace(/\|/g, '-').trim(),
            deadline: (item.deadline || item.due || 'None').replace(/\|/g, '-').trim()
        })).filter(item => item.item.length > 0);
    } catch (err) {
        console.log(`    ⚠️  Could not parse response as JSON, skipping...`);
        return [];
    }
}

// Read existing tracker file
function readTracker() {
    if (!fs.existsSync(TRACKER_FILE)) {
        return { activeItems: [], completedItems: [] };
    }
    
    const content = fs.readFileSync(TRACKER_FILE, 'utf8');
    const activeItems = [];
    const completedItems = [];
    
    const activeMatch = content.match(/## Active Items\n\n\|[^\n]+\n\|[^\n]+\n([\s\S]*?)(?=\n## Completed Items|\n---)/);
    if (activeMatch) {
        const rows = activeMatch[1].trim().split('\n').filter(r => r.startsWith('|'));
        for (const row of rows) {
            const cols = row.split('|').map(c => c.trim()).filter(c => c);
            if (cols.length >= 5) {
                activeItems.push({
                    done: cols[0].includes('[x]'),
                    dateAdded: cols[1],
                    source: cols[2],
                    item: cols[3],
                    from: cols[4],
                    deadline: cols[5] || 'None'
                });
            }
        }
    }
    
    const completedMatch = content.match(/## Completed Items\n\n\|[^\n]+\n\|[^\n]+\n([\s\S]*?)(?=\n---)/);
    if (completedMatch) {
        const rows = completedMatch[1].trim().split('\n').filter(r => r.startsWith('|'));
        for (const row of rows) {
            const cols = row.split('|').map(c => c.trim()).filter(c => c);
            if (cols.length >= 5) {
                completedItems.push({
                    done: true,
                    dateAdded: cols[1],
                    dateCompleted: cols[2],
                    source: cols[3],
                    item: cols[4],
                    from: cols[5] || 'Unknown'
                });
            }
        }
    }
    
    return { activeItems, completedItems };
}

// Write updated tracker file
function writeTracker(activeItems, completedItems) {
    const today = new Date().toISOString().split('T')[0];
    
    // Ensure tracker directory exists
    const trackerDir = path.dirname(TRACKER_FILE);
    if (!fs.existsSync(trackerDir)) {
        fs.mkdirSync(trackerDir, { recursive: true });
    }
    
    let content = `# 📋 Task Tracker

> This file is automatically updated by \`action-items.js\`. Check off items as you complete them.

## Active Items

| Done | Date Added | Source | Action Item | From | Deadline |
|:----:|:----------:|:------:|-------------|------|----------|
`;
    
    for (const item of activeItems) {
        const checkbox = item.done ? '[x]' : '[ ]';
        content += `| ${checkbox} | ${item.dateAdded} | ${item.source} | ${item.item} | ${item.from} | ${item.deadline} |\n`;
    }
    
    content += `
## Completed Items

| Done | Date Added | Date Completed | Source | Action Item | From |
|:----:|:----------:|:--------------:|:------:|-------------|------|
`;
    
    for (const item of completedItems) {
        content += `| [x] | ${item.dateAdded} | ${item.dateCompleted || today} | ${item.source} | ${item.item} | ${item.from} |\n`;
    }
    
    content += `
---

_Last updated: ${today}_
`;
    
    fs.writeFileSync(TRACKER_FILE, content, 'utf8');
}

// Check if an item already exists (to avoid duplicates)
function itemExists(existingItems, newItem) {
    return existingItems.some(existing => 
        existing.item.toLowerCase() === newItem.item.toLowerCase() &&
        existing.source === newItem.source
    );
}

// Main
async function main() {
    const dateRange = getDateRange();
    
    console.log(`\n🎯 Daily Action Items`);
    console.log(`📅 Date range: ${dateRange.start}${dateRange.start !== dateRange.end ? ` to ${dateRange.end}` : ''}`);
    console.log(`📂 Tracker: ${TRACKER_FILE}`);
    if (NO_APPEND) console.log(`⚠️  Will NOT append to tracker file`);
    
    console.log(`\n📂 Loading prompts from agent...`);
    const prompts = loadPrompts();
    console.log(`   ✅ Loaded ${Object.keys(prompts).length} prompt(s): ${Object.keys(prompts).join(', ')}`);
    
    console.log('\n🔌 Connecting to Work IQ...');
    const client = await createWorkIQClient();
    console.log('✅ Connected!');
    
    try {
        const newItems = await gatherActionItems(client, dateRange, prompts);
        
        if (newItems.length === 0) {
            console.log('\n✨ No new action items found - you\'re all caught up!');
        } else {
            console.log(`\n📊 Found ${newItems.length} action item(s)`);
            
            console.log('\n' + '═'.repeat(60));
            for (const item of newItems) {
                console.log(`  ${item.source} | ${item.item}`);
                console.log(`    └─ From: ${item.from} | Deadline: ${item.deadline}`);
            }
            console.log('═'.repeat(60));
            
            if (!NO_APPEND) {
                const { activeItems, completedItems } = readTracker();
                
                const stillActive = [];
                const newlyCompleted = [];
                for (const item of activeItems) {
                    if (item.done) {
                        newlyCompleted.push({
                            ...item,
                            dateCompleted: new Date().toISOString().split('T')[0]
                        });
                    } else {
                        stillActive.push(item);
                    }
                }
                
                let addedCount = 0;
                for (const item of newItems) {
                    if (!itemExists(stillActive, item) && !itemExists(completedItems, item)) {
                        stillActive.push(item);
                        addedCount++;
                    }
                }
                
                writeTracker(stillActive, [...completedItems, ...newlyCompleted]);
                
                console.log(`\n📝 Tracker updated: ${addedCount} new item(s) added`);
                if (newlyCompleted.length > 0) {
                    console.log(`   ✅ ${newlyCompleted.length} item(s) moved to completed`);
                }
                console.log(`   📄 File: ${TRACKER_FILE}`);
            }
        }
        
    } finally {
        await client.close();
    }
    
    console.log('\n✨ Done!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
