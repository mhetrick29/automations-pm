# Product Context

Vision docs and planning priorities that ground all agents in current product strategy. All agents should read these files before generating output.

## Files

- `Brain_AIOps_Purpose_and_Path_Forward_Dec_2025.md` — Product purpose and strategic direction
- `Brain_Vision_Health_and_Monitoring_AI_era.md` — Vision for health and monitoring in the AI era
- `Brain_Priorities_Feb_2026.md` — Current planning priorities
- `Rubidium_Priorities.md` — Rubidium release priorities
- `image1.png` through `image4.png` — Supporting diagrams referenced by the docs above

## SharePoint Integration (Future)

> **SharePoint URL:** _TBD — user will provide when ready_

When the SharePoint URL is configured:
1. Agents should fetch product context docs from SharePoint first
2. Fall back to local copies in this directory if SharePoint is unavailable
3. Local copies should be periodically synced with SharePoint versions

## Knowledge Bot MCP (Future)

For deeper domain lookups beyond what's in product-context/, the team's Knowledge Bot MCP can be called when available. This is not yet configured.

When the Knowledge Bot MCP is available:
1. MCP server config will be added to tool-specific config files (`.vscode/mcp.json`, `.claude/settings.local.json`, etc.)
2. Agent system prompts will be updated to query the Knowledge Bot for domain details not covered here
3. This supplements `team-knowledge/` — it doesn't replace it
