# Action Items Agent

Gets your action items from Teams chats, meetings, and Outlook emails using Work IQ.

## Usage

Use `/get-action-items` in Copilot Chat to fetch and display your action items for the day.

### Options
- Default: Get today's action items
- Ask for "last 7 days" or "this week" to look back further

## How It Works

1. Agent reads prompts from `agents/action-items/get-action-items.md`
2. Agent calls Work IQ MCP tools with those prompts
3. Agent parses the JSON results
4. Agent updates the tracker file (configurable path, default: `~/OneDrive - Microsoft/Projects/_automation/task-tracker.md`)
5. Agent presents results in a table

## Files

- `get-action-items.md` - Work IQ prompts (edit to tune extraction)
- `action-items-agent.system.md` - Agent instructions
- `tools/action-items.js` - Automation script
