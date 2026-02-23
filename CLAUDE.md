# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A **PM automation toolkit** built around 4 specialized Copilot agents for the Brain/AIOps platform at Microsoft. This is not a compiled application — it's an agent-based system where the primary artifacts are system prompts, knowledge files, and lightweight tooling scripts.

## Architecture

### Four Layers

1. **Agents** (`agents/`) — 4 Copilot agents registered via `copilot.json`:
   - **Spec Writer** (`spec-writer/`) — Generates executive-ready one-pagers and full product specs from notes or prompts. Uses knowledge files (templates, style guide, examples) grounded in Brain/AIOps context.
   - **User Research** (`user-research/`) — Plans studies, creates research scripts, synthesizes findings with severity/confidence scoring. Operates in 5 modes (Discovery, Evaluation, Iteration, Spec Partner, Repository).
   - **Prototyping** (`prototyping-agent/`) — Converts product specs into deployable Next.js (TypeScript) prototypes targeting Vercel.
   - **Action Items** (`action-items/`) — Extracts action items from Teams/Email via Work IQ MCP tools. Uses `tools/action-items.js`.

2. **Shared Knowledge** (`team-knowledge/`) — Product context, Brain domain reference, writing style guide, and personal style overrides. All agents read from here.

3. **Tools & Agent-Specific Knowledge** (`tools/`, `agents/*/knowledge/`) — Shared utilities (doc extraction, action items, ADO sync, end-of-day, doc classification) and agent-specific reference material (templates, content samples, checklists).

**Note:** Projects live in a separate repo at `~/OneDrive - Microsoft/Projects/`. Tools that interact with projects use the `PROJECTS_DIR` environment variable (defaults to that path).

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

### Project automation
```bash
node tools/end-of-day.js                          # Daily summaries per project
node tools/sync-ado.js                             # Update manifests from ADO
node tools/classify-docs.js                        # Classify today's edited docs
node tools/action-items.js                         # Extract action items via Work IQ
```

Note: These scripts default to `~/OneDrive - Microsoft/Projects/` for the projects folder.
Set `PROJECTS_DIR` environment variable to override.

## Key Conventions

- **Shared knowledge** lives in `team-knowledge/` — product context, Brain domain reference, writing style guide, and personal style overrides. All agents read from here at startup.
- **Agent-specific knowledge** lives in `agents/*/knowledge/` — templates, content samples, checklists, and other material unique to each agent.
- **Content samples** (`agents/spec-writer/knowledge/content-samples/`) are references for writing voice and technical depth — their structure predates current templates and should NOT be used as structural models.
- **Product context** (`team-knowledge/product-context/`) contains vision and priorities docs. Local files serve as a cache; agents check for SharePoint updates at startup via `node tools/fetch-knowledge.js --status`. See `team-knowledge/config.yaml` for file mappings.
- **Brain teams** are documented in `team-knowledge/brain-domain.md`: AI Models, AI Platform, AI Monitoring-Pipeline, AI Monitoring-Actions, Auto-Diagnosis, AI Experiences. External partners: SLO/SLI Platform, ARG, IcM.
- **Writing style** follows a layered model: `team-knowledge/writing-style-guide.md` (team default) + optional `team-knowledge/writing-styles/[name]-style.md` (personal overrides).

## Git

- **Never include `Co-Authored-By` lines referencing Claude** in commit messages.

## Copilot Behavior Guidelines

See `.github/copilot-instructions.md` for full details. Key points:
- **No approval needed for read-only operations** — ADO searches, document reads, file searches. Execute immediately.
- **Always check `.vscode/mcp.json`** for ADO project/area path scoping before searching work items.
- **Check `tools/*.skill.md`** for predefined workflows before performing common tasks.
- **Project context**: read `manifest.yaml` → extract `ado.tag` → query ADO live → read all project docs → synthesize.
