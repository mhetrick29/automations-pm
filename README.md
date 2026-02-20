# PM Automation Toolkit — Brain/AIOps

4 specialized Copilot agents + a shared knowledge layer for product management work on the Brain/AIOps platform at Microsoft.

---

## Architecture

Four layers:

| Layer | Path | Purpose |
|-------|------|---------|
| **Agents** | `agents/` | 4 Copilot agents, each with a two-file definition (card + system prompt) |
| **Shared Knowledge** | `team-knowledge/` | Product context, Brain domain model, writing style — loaded by all agents |
| **Tools** | `tools/` | Shared utilities (doc extraction, outline generation) |
| **Projects** | `Projects/` | Manifest-driven project tracking with ADO integration |

### Why specialized agents, not one PM agent

`team-knowledge/` is already the unified PM context layer. Every agent loads the same product context, domain model, and writing style. That IS the shared brain.

Splitting into specialized agents means:

- **Focused system prompts.** A single prompt covering specs, research, prototyping, and action items would be diluted and worse at every task.
- **Unambiguous routing.** Copilot routes by trigger phrase. Focused triggers ("write spec", "research plan") are unambiguous; a generalist agent needs broad triggers and internal routing Copilot can't natively handle.
- **Low regression risk.** Adding a new PM capability = new agent following the two-file pattern. Existing agents are untouched.

---

## Agents

| Agent | Trigger phrases | What it does |
|-------|----------------|--------------|
| **Spec Writer** | `write spec`, `draft spec`, `one pager`, `PRD`, `brainstorm epic`, `let's brainstorm` | Generates executive one-pagers and full product specs from notes or prompts; supports interactive Brainstorm Mode |
| **User Research** | `research plan`, `discussion guide`, `interview guide`, `synthesis`, `insights` | Plans studies, creates discussion guides, synthesizes findings with severity/confidence scoring |
| **Prototyping** | `create prototype`, `make prototype`, `deployable prototype`, `wireframe` | Converts a product spec into a deployable Next.js (TypeScript) prototype targeting Vercel |
| **Action Items** | `/get-action-items` | Extracts action items from Teams/Email via Work IQ MCP tools; persists to `Projects/_automation/action-items.md` |

---

## Folder Structure

```
agents/
  spec-writer/
    spec-writer-agent.md            # Agent card + metadata
    spec-writer-agent.system.md     # System prompt
    knowledge/
      review-checklist.md
      templates/
        Unified_Spec_Template.md
        Epic-Spec-Template.md
      content-samples/              # Reference specs (voice/content, not structure)
  user-research/
    user-research-agent.md
    user-research-agent.system.md
    knowledge/
  prototyping-agent/
    prototyping-agent.md
    prototyping-agent.system.md
  action-items/
    action-items-agent.md
    action-items-agent.system.md
    get-action-items.md             # Work IQ prompts

team-knowledge/                     # SHARED — all agents read this
  brain-domain.md                   # Brain teams, ecosystem, terminology
  writing-style-guide.md            # Team-level writing conventions
  writing-styles/
    matthew-style.md                # Personal spec-writing patterns
  product-context/                  # Vision & priorities docs (user-maintained)

tools/
  read-doc.js                       # Extract text from .docx/.pptx/.xlsx
  outline-generator.md
  slide-writer.md

Projects/
  _automation/
    action-items.md                 # Persistent action items tracker
    run_daily.py
    sync-ado.js
  [project-name]/
    manifest.yaml                   # ADO tag, OKRs, doc tracking, team info

copilot.json                        # Agent registry
```

---

## Setup

One-time tool install:

```bash
cd tools && npm install
```

---

## Invocation Examples

```bash
# Spec Writer — one-pager + full spec
copilot agents run -f agents/spec-writer/spec-writer-agent.md "Draft a one-pager + full spec for <capability>"

# Spec Writer — brainstorm mode
copilot agents run -f agents/spec-writer/spec-writer-agent.md "Let's brainstorm an epic for <topic>"

# Spec Writer — system prompt directly
copilot chat -s agents/spec-writer/spec-writer-agent.system.md -p "Turn these notes into a one-pager and full spec: <paste notes>"

# User Research — discussion guide
copilot agents run -f agents/user-research/user-research-agent.md "Create a discussion guide for <topic>" --files <folder>

# User Research — synthesis
copilot agents run -f agents/user-research/user-research-agent.md "Synthesize findings from these interview notes" --files <folder>

# Prototyping
copilot agents run -f agents/prototyping-agent/prototyping-agent.md "Create a deployable prototype for project <folder>. Use <spec-file> as the spec. Target Vercel." --files <folder>

# Action Items
# In Copilot Chat: /get-action-items
```

---

## Adding a New Agent

1. Create `agents/<name>/` with two files:
   - `<name>-agent.md` — YAML frontmatter (id, name, version, triggers, capabilities) + markdown body (purpose, knowledge index, domain context)
   - `<name>-agent.system.md` — YAML frontmatter + system prompt (mission, output contract, authoring rules, style)
2. Register the agent in `copilot.json`.
3. Add shared context to `team-knowledge/` or agent-specific reference material to `agents/<name>/knowledge/`.
