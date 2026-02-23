# PM Automation Toolkit — Brain/AIOps

5 specialized Copilot agents + a shared knowledge layer for product management work on the Brain/AIOps platform at Microsoft.

---

## Architecture

Three layers:

| Layer | Path | Purpose |
|-------|------|---------|
| **Agents** | `agents/` | 5 Copilot agents, each with a two-file definition (card + system prompt) |
| **Shared Knowledge** | `team-knowledge/` | Product context, Brain domain model, writing style — loaded by all agents. Syncs from SharePoint via `tools/fetch-knowledge.js`. |
| **Tools** | `tools/` | Shared utilities (doc extraction, action items, ADO sync, end-of-day, doc classification, knowledge sync) |

### Why specialized agents, not one PM agent

`team-knowledge/` is already the unified PM context layer. Every agent loads the same product context, domain model, and writing style. That IS the shared brain.

Splitting into specialized agents means:

- **Focused system prompts.** A single prompt covering specs, research, prototyping, and action items would be diluted and worse at every task. We are building a toolkit for PMs, not a full development team. Long-term, each agent becomes a skill that a PM "team leader" agent can spawn as needed during the software development lifecycle.
- **Unambiguous routing.** Copilot routes by trigger phrase. Focused triggers ("write spec", "research plan") are unambiguous; a generalist agent needs broad triggers and internal routing Copilot can't natively handle.
- **Low regression risk.** Adding a new PM capability = new agent following the two-file pattern. Existing agents are untouched.

---

## Agents

| Agent | Trigger phrases | What it does |
|-------|----------------|--------------|
| **Spec Writer** | `write spec`, `draft spec`, `one pager`, `PRD`, `brainstorm epic`, `let's brainstorm` | Generates executive one-pagers and full product specs from notes or prompts; supports interactive Brainstorm Mode |
| **User Research** | `research plan`, `discussion guide`, `interview guide`, `synthesis`, `insights`, `analyze transcripts`, `JTBD` | Research strategist for any type of customer/user research; multi-transcript analysis with AI guardrails via interview-analysis skill |
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

team-knowledge/                     # SHARED — all agents read this
  brain-domain.md                   # Brain teams, ecosystem, terminology
  writing-style-guide.md            # Team-level writing conventions
  writing-styles/
    matthew-style.md                # Personal spec-writing patterns
  product-context/                  # Vision & priorities docs (user-maintained)

tools/
  read-doc.js                       # Extract text from .docx/.pptx/.xlsx
  action-items.js                   # Extract action items via Work IQ
  sync-ado.js                       # Update project manifests from ADO
  classify-docs.js                  # Classify today's edited docs into projects
  end-of-day.js                     # Daily summaries per project via Work IQ
  md-to-docx.js                     # Convert markdown to Word
  outline-generator.md
  slide-writer.md

skills/                             # SHARED — reusable skills any agent can invoke
  interview-analysis.skill.md       # Multi-transcript analysis with AI guardrails
  md-to-pdf.skill.md                # Convert markdown to PDF

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

## Usage

All agents are registered in `copilot.json` and available in **VS Code Copilot Chat** via `@agent-id`. Open the Chat panel and type:

### Spec Writer

```
@spec-writer-agent Draft a one-pager + full spec for <capability>
@spec-writer-agent Let's brainstorm an epic for <topic>
@spec-writer-agent Turn these notes into a one-pager and full spec: <paste notes>
```

### User Research

```
@user-research-agent Create a discussion guide for <topic>
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
