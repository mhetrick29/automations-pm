
# Prototyping Agent Bundle

This bundle registers a **Prototyping Agent** for Copilot CLI / Copilot Chat. The agent converts a product spec plus a folder of context files into a deployable **Next.js (TypeScript)** prototype suitable for **Vercel**.

## Contents
- `agents/prototyping-agent.md` — Agent definition (metadata, triggers, capabilities, guidance)
- `agents/agent.system.md` — The system prompt used as the entrypoint
- `copilot.json` — Manifest that registers the agent with Copilot CLI
- `.gitignore` — Node/Next.js/Vercel-appropriate ignores

## Quick Start (Copilot CLI)
1. Place this folder at the root of your workspace (e.g., `./agents`).
2. Merge or use the provided `copilot.json` (append to your existing manifest if you already have one).
3. From a terminal at the workspace root, run:

```bash
copilot run agents/prototyping-agent -- "Create a deployable prototype for project <folder>. Use <file name> as the product spec; use other files in the folder as context. Target vercel."
```

## Quick Start (Copilot Chat in VS Code)
- Attach or reference your project folder and spec file.
- Say: *"Use **Prototyping Agent** with this folder. Create a Next.js prototype for Vercel; the spec is `<file name>`."*

## Output Expectations
- A minimal, accessible Next.js app (App Router) with 5–9 pages covering the primary flow.
- `README.md` (dev + test + Vercel deploy) and `EXEC-ONE-PAGER.md` (leadership narrative).

## Notes
- Keep credentials and secrets out of code. Use placeholders and Vercel environment variables if the spec requires them.
- If the agent needs clarification, it should ask up to 3 questions, then proceed with documented assumptions.
