# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A **PM automation toolkit** built around 4 specialized Copilot agents for the Brain/AIOps platform at Microsoft. This is not a compiled application — it's an agent-based system where the primary artifacts are system prompts, knowledge files, and lightweight tooling scripts.

## Architecture

### Three Layers

1. **Agents** (`agents/`) — 4 Copilot agents registered via `copilot.json`:
   - **Spec Writer** (`spec-writer/`) — Generates executive-ready one-pagers and full product specs from notes or prompts. Uses knowledge files (templates, style guide, examples) grounded in Brain/AIOps context.
   - **User Research** (`user-research/`) — Plans studies, creates research scripts, synthesizes findings with severity/confidence scoring. Operates in 5 modes (Discovery, Evaluation, Iteration, Spec Partner, Repository).
   - **Prototyping** (`prototyping-agent/`) — Converts product specs into deployable Next.js (TypeScript) prototypes targeting Vercel.
   - **Action Items** (`action-items/`) — Extracts action items from Teams/Email via Work IQ MCP tools. Persists to `Projects/_automation/action-items.md`.

2. **Tools & Knowledge** (`tools/`, `agents/*/knowledge/`) — Shared utilities and agent-specific reference material.

3. **Project System** (`Projects/`) — Manifest-driven project tracking with ADO integration. Each project has a `manifest.yaml` with ADO tag, OKRs, document tracking, and team info.

### Agent File Convention

Each agent follows a two-file pattern:
- `[name]-agent.md` — YAML frontmatter (metadata, tools, triggers) + markdown body (purpose, knowledge index, domain-specific context)
- `[name]-agent.system.md` — YAML frontmatter + system prompt (mission, output contract, authoring rules, style)

Agents are registered in the top-level `copilot.json` manifest.

## Commands

### Tools setup (one-time)
```bash
cd tools && npm install
```

### Extract text from Office documents
```bash
node tools/read-doc.js "path/to/document.docx"   # .docx, .pptx, .xlsx
```

### Run an agent via Copilot CLI
```bash
copilot agents run -f agents/spec-writer/spec-writer-agent.md "Draft a one-pager for <capability>"
copilot chat -s agents/spec-writer/spec-writer-agent.system.md -p "<prompt>"
```

### Project automation (Python)
```bash
python Projects/_automation/run_daily.py          # Daily doc classification + sync
node Projects/_automation/sync-ado.js             # Update manifests from ADO
```

## Key Conventions

- **Spec Writer knowledge** lives in `agents/spec-writer/knowledge/` — templates, style guide, review checklist, content samples, and user-maintained `product-context/` docs. The system prompt instructs the agent to read these before generating.
- **Content samples** (`content-samples/`) are references for writing voice and technical depth — their structure predates current templates and should NOT be used as structural models.
- **Product context** (`knowledge/product-context/`) contains vision and priorities docs maintained by the user. The agent asks if these need updating before starting.
- **Brain teams** referenced across specs: AI Models, AI Platform, AI Monitoring-Pipeline, AI Monitoring-Actions, Auto-Diagnosis, AI Experiences. External partners: SLO/SLI Platform, ARG, IcM.

## Git

- **Never include `Co-Authored-By` lines referencing Claude** in commit messages.

## Copilot Behavior Guidelines

See `.github/copilot-instructions.md` for full details. Key points:
- **No approval needed for read-only operations** — ADO searches, document reads, file searches. Execute immediately.
- **Always check `.vscode/mcp.json`** for ADO project/area path scoping before searching work items.
- **Check `tools/*.skill.md`** for predefined workflows before performing common tasks.
- **Project context**: read `manifest.yaml` → extract `ado.tag` → query ADO live → read all project docs → synthesize.
