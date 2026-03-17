# PM Agent Teams Bot

A Teams bot that surfaces the PM agent stack (Idea Triage, Spec Writer, User Research, Prototyping) in any Microsoft Teams chat.

## Architecture

```
Teams @mention → Bot Framework → Intent Classification → Agent Prompt Loading → Azure OpenAI → Response
```

**Core modules:**
- `src/index.ts` — Teams bot entry point, message handler, Restify server
- `src/promptLoader.ts` — Reads .system.md and .skill.md files, assembles system prompts
- `src/router.ts` — PM Lead intent classification from user messages
- `src/openaiClient.ts` — Azure OpenAI chat completions with tool-call loop
- `src/tools.ts` — Tool definitions + executors (ADO, WorkIQ, Git)
- `src/conversationState.ts` — Per-thread conversation state management

## Prerequisites

- Node.js 18+
- Azure OpenAI endpoint + API key
- Azure Bot Service registration
- Microsoft 365 tenant with Teams

## Setup

1. **Clone and install:**
   ```bash
   cd prototypes/pm-agent-bot
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.template .env
   # Edit .env with your Azure OpenAI and Bot Framework credentials
   ```

3. **Build:**
   ```bash
   npm run build
   ```

4. **Run locally:**
   ```bash
   npm run dev
   ```

5. **Test with Bot Framework Emulator** or **Teams Toolkit debug** (F5 in VS Code)

## Deploying to Teams

1. **Register a bot** in the [Azure Portal](https://portal.azure.com) → Bot Services
2. **Update** `.env` with `BOT_ID` and `BOT_PASSWORD`
3. **Update** `appPackage/manifest.json` — replace `{{BOT_ID}}` with your bot's App ID
4. **Add bot icons** — place `color.png` (192x192) and `outline.png` (32x32) in `appPackage/`
5. **Zip** the `appPackage/` folder
6. **Sideload** in Teams: Apps → Manage your apps → Upload a custom app
7. **Deploy** the bot to Azure App Service for production

## Usage

In any Teams chat, @mention the bot:

- `@PMAgent I have an idea for self-healing alerts` → Idea Triage
- `@PMAgent brainstorm a spec for alert suppression` → Spec Writer
- `@PMAgent what's the status of the IM rollout?` → ADO query
- `@PMAgent what was discussed in yesterday's standup?` → WorkIQ meeting query

The bot maintains conversation context per-thread — replies in a thread continue the same agent session.

## V1 Scope

- ✅ Chat-based agent interaction (multi-turn)
- ✅ Intent classification + agent routing (PM Lead logic)
- ✅ ADO work item queries (stub — wire to real API)
- ✅ WorkIQ meeting queries (stub — wire to real API)
- ✅ File output to repo (local write — add git push)
- ⬜ Full MCP server integration (V2)
- ⬜ Meeting transcript access (V2)
- ⬜ Scheduled digests (V3)

## Tool Stubs

The `src/tools.ts` file contains stub implementations for all tools. To make them real:

1. **ADO tools** — Replace stubs with Azure DevOps REST API calls (`https://dev.azure.com/{org}/_apis/...`)
2. **WorkIQ** — Replace stub with WorkIQ MCP client call or Graph API
3. **Git output** — Replace local file write with `simple-git` commit + push

Each stub is marked with `// TODO: Replace with real API call`.
