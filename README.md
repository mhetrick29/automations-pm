# PM Automation Toolkit — Brain/AIOps

6 specialized Copilot agents + a shared knowledge layer for product management work on the Brain/AIOps platform at Microsoft.

---

## Architecture

Four layers:

| Layer | Path | Purpose |
|-------|------|---------|
| **Agents** | `agents/` | 6 Copilot agents, each with a two-file definition (card + system prompt). PM Lead orchestrator routes to specialists. |
| **Skills** | `skills/` | Reusable skill files any agent can invoke (interview analysis, customer requirements analysis, product why-first thinking, document handling) |
| **Shared Knowledge** | `team-knowledge/` | Product context, Brain domain model, writing style — loaded by all agents. Syncs from SharePoint via `tools/fetch-knowledge.js`. |
| **Tools** | `tools/` | Shared utilities (doc extraction, knowledge sync, action items, ADO sync, end-of-day, doc classification) |
| **MCP Servers** | `mcp.json` | Three MCP servers wired to agents: Azure DevOps, Work IQ, GitHub |

### Why specialized agents, not one PM agent

`team-knowledge/` is already the unified PM context layer. Every agent loads the same product context, domain model, and writing style. That IS the shared brain.

Splitting into specialized agents means:

- **Focused system prompts.** A single prompt covering specs, research, prototyping, and action items would be diluted and worse at every task. We are building a toolkit for PMs, not a full development team. The PM Lead agent acts as the routing layer — classifying intent and activating the right specialist — so users get a single entry point without sacrificing specialization.
- **Unambiguous routing.** The PM Lead classifies intent semantically, not just by keyword. Users describe what they need in natural language; the orchestrator loads the right agent. Individual agents can still be invoked directly via `@agent-id` when the user knows which one they want.
- **Low regression risk.** Adding a new PM capability = new agent following the two-file pattern. Existing agents are untouched.

---

## Agents

| Agent | Trigger phrases | What it does |
|-------|----------------|--------------|
| **PM Lead** | `help me with`, `I need to`, `work on`, or any input | Default entry point. Classifies intent and routes to the right specialist. Manages cross-agent pipelines. |
| **Spec Writer** | `write spec`, `draft spec`, `one pager`, `PRD`, `brainstorm epic`, `let's brainstorm` | Generates executive one-pagers and full product specs from notes or prompts; supports interactive Brainstorm Mode |
| **User Research** | `research plan`, `discussion guide`, `interview guide`, `synthesis`, `insights`, `analyze transcripts`, `customer requirements`, `JTBD` | Research strategist for any type of customer/user research; multi-transcript analysis with AI guardrails via interview-analysis skill; customer requirement doc analysis via customer-requirements-analysis skill |
| **Prototyping** | `create prototype`, `make prototype`, `deployable prototype`, `wireframe` | Converts a product spec into a deployable Next.js (TypeScript) prototype targeting Vercel |
| **Action Items** | `/get-action-items` | Extracts action items from Teams/Email via Work IQ MCP tools; uses `tools/action-items.js` |
| **Brain Dump** | `brain dump`, `turn this into a doc`, `structure my thoughts`, `clean this up` | Turns unstructured stream-of-consciousness notes into a polished strategic narrative (problems, gaps, pillars, phases, metrics) |

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
  brain-dump/
    brain-dump-agent.md
    brain-dump-agent.system.md
  pm-lead/
    pm-lead-agent.md
    pm-lead-agent.system.md

team-knowledge/                     # SHARED — all agents read this
  brain-domain.md                   # Brain teams, capabilities, ecosystem, terminology
  config.yaml                       # Knowledge source registry (local, SharePoint, ADO repo, MCP)
  writing-style-guide.md            # Team-level writing conventions
  writing-styles/
    matthew-style.md                # Personal writing patterns (auto-updated per conversation)
  product-context/                  # Vision & priorities docs (user-maintained)

tools/
  read-doc.js                       # Extract text from .docx/.pptx/.xlsx
  fetch-knowledge.js                # Team knowledge sync (--status, --pull, --snapshot, --convert)
  action-items.js                   # Extract action items via Work IQ
  sync-ado.js                       # Update project manifests from ADO
  classify-docs.js                  # Classify today's edited docs into projects
  end-of-day.js                     # Daily summaries per project via Work IQ
  md-to-docx.js                     # Convert markdown to Word

skills/                             # SHARED — reusable skills any agent can invoke
  interview-analysis.skill.md       # Multi-transcript analysis with AI guardrails
  customer-requirements-analysis.skill.md  # Customer requirement doc analysis with why-first excavation
  product-why-first.skill.md        # Five-layer analysis for separating problems from solutions
  doc-handling.skill.md             # Read Office docs, convert markdown → Word or PDF

copilot.json                        # Agent registry
```

**Note:** Projects live in a separate repo at `~/OneDrive - Microsoft/Projects/`. Tools that interact with projects use the `PROJECTS_DIR` environment variable (defaults to that path).

---

## Setup

One-time tool install:

```bash
cd tools && npm install
```

---

## MCP Servers

Three MCP servers are configured in `mcp.json` and used by agents and workflows:

| Server | Package | Used by |
|--------|---------|---------|
| **Azure DevOps** (`ado`) | `@azure-devops/mcp` | All agents — browsing work items, PRs, iterations, repos. Scoped to project `One`, area `Azure Edge and Platform\Health and Standards\AIOps`. Uses interactive auth (no stored credentials). |
| **Work IQ** (`workiq`) | `@microsoft/workiq` | Action Items agent, end-of-day workflow — extracts action items and summaries from Teams chats, meetings, and Outlook. |
| **GitHub** (`github`) | `github:mcp-server` (plugin) | Project overviews — reading repos, commits, PRs when exploring linked GitHub repositories. |

`mcp.json` is safe to commit — no credentials are stored. ADO uses interactive auth (`--authentication interactive`); Work IQ and GitHub use the host environment's logged-in identity.

---

## Usage

All agents are registered in `copilot.json` and available in **VS Code Copilot Chat** via `@agent-id`. Open the Chat panel and type:

### PM Lead (recommended default)

```
@pm-lead-agent Help me analyze these customer feedback docs
@pm-lead-agent I need to structure my thoughts about intelligent monitors
@pm-lead-agent Let's turn these customer asks into a spec
```

The PM Lead classifies your intent and activates the right specialist automatically. You can also invoke agents directly:

### Spec Writer

```
@spec-writer-agent Draft a one-pager + full spec for <capability>
@spec-writer-agent Let's brainstorm an epic for <topic>
@spec-writer-agent Turn these notes into a one-pager and full spec: <paste notes>
```

### User Research

```
@user-research-agent Create a discussion guide for <topic>
@user-research-agent Analyze these interview transcripts: <attach files>
@user-research-agent Create a JTBD canvas for <persona> doing <task>
@user-research-agent Synthesize findings from these interview notes
```

### Prototyping

```
@prototyping-agent Create a deployable prototype from <spec-file>. Target Vercel.
```

### Action Items

```
@get-action-items Extract action items from my recent Teams messages
```

### Brain Dump

```
@brain-dump-agent Structure my thoughts: <paste notes or provide file path>
@brain-dump-agent Turn this into a doc: <paste stream-of-consciousness>
```

### Tips

- **Attach files** — drag files into the chat or use `#file:path` to give agents additional context (specs, notes, interview transcripts).
- **Project context** — agents automatically load shared knowledge from `team-knowledge/`. No need to re-explain Brain/AIOps context.
- **Brainstorm mode** — the Spec Writer supports interactive back-and-forth; just start with "Let's brainstorm" and keep the conversation going.

---

## Common Workflow: Brain Dump → Epic Spec

The **Brain Dump** and **Spec Writer** agents work together as a planning pipeline. Here's a typical flow:

### 1. Capture raw thoughts
Walk the dog, hop in the car, or sit at your desk — brain dump ideas however works for you:
- Record a Teams meeting with yourself and talk through your thoughts
- Send yourself a Teams message with rough notes
- Type a stream-of-consciousness directly into the CLI

> Audio file input is planned but not yet supported.

### 2. Structure with Brain Dump agent
Paste or reference your raw notes and let the agent organize them:
```
@brain-dump-agent Structure these thoughts: <paste notes>
```
It outputs structured markdown and Word docs covering: where we are today, the gaps, potential solutions, and a phased approach. Go back and forth with the agent until it reads right.

### 3. Brainstorm the Epic Spec
Take the structured output and feed it into the Spec Writer:
```
@spec-writer Let's brainstorm the epic spec for {epic} using #file:brain-dump-output.md
```
The agent enters **brainstorm mode** — walking through each section, challenging your assumptions, and sharpening the spec through dialogue. It uses a **grader skill** informed by spec review best practices and common engineering feedback to keep the bar high.

### 4. Output and polish
After brainstorming, the agent generates a full epic spec. With light formatting and revision, you have a ready-to-share spec.

---

## Adding a New Agent

1. Create `agents/<name>/` with two files:
   - `<name>-agent.md` — YAML frontmatter (id, name, version, triggers, capabilities) + markdown body (purpose, knowledge index, domain context)
   - `<name>-agent.system.md` — YAML frontmatter + system prompt (mission, output contract, authoring rules, style)
2. Register the agent in `copilot.json`.
3. Add shared context to `team-knowledge/` or agent-specific reference material to `agents/<name>/knowledge/`.

## Adding a New Skill

1. Create `skills/<name>.skill.md` with: triggers, workflow steps, and guardrails.
2. Reference the skill from any agent's system prompt (e.g., `Read and follow skills/<name>.skill.md`).
3. Skills are atomic and reusable — they define *what* to do, not *who* does it.
