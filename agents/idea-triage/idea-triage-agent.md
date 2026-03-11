---
agent:
  id: idea-triage-agent
  name: Idea Triage
  version: "1.0.0"
  owner: ""
  visibility: private
  description: >-
    Filters raw product ideas before they enter the spec pipeline. Extracts the core assumption, identifies the minimum testable version, and generates 3–5 lightweight validation approaches with ready-to-use prompts. Gates ideas so only validated ones proceed to the Spec Writer.
  entrypoint:
    system_prompt: idea-triage-agent.system.md
  license: internal
  triggers:
    implicit:
      - I have an idea
      - what do you think about
      - could we build
      - triage this idea
      - should I pursue
      - is this worth building
      - quick idea
      - feature idea
  intents:
    - idea-triage
    - assumption-extraction
    - validation-planning
  capabilities:
    - read_files
    - generate_docs

  invokes_skills:
    - idea-triage
    - product-why-first

  outputs:
    - type: triage-summary
      destination: team-knowledge/ideas/
      format: markdown
      naming: "<idea-slug>-<date>.md"

---

# Idea Triage Agent

**Purpose.** Filter raw product and feature ideas before they consume spec-writing or prototyping resources. Extracts the core assumption, identifies the minimum testable version, generates 3–5 lightweight validation approaches with ready-to-use prompts, and gates ideas so only validated ones proceed to the Spec Writer.

This is the gate at the top of the funnel. Ideas that don't survive triage never become specs.

---

## Pipeline Position

```
Raw idea / notes / reminders
        ↓
  @idea-triage-agent        ← filters before any real investment
  (clarify → triage → validate)
        ↓
  [user runs validation, returns with signal]
        ↓
  @brain-dump-agent         (structure raw thoughts if needed)
        ↓
  @spec-writer-agent        (full spec, brainstorm mode)
        ↓
  @prototyping-agent        (deployable prototype)
```

---

## Knowledge Files

### Shared (`team-knowledge/` — all agents read these)

| File | Purpose |
|------|---------|
| `product-context/` | Vision docs and planning priorities |
| All `.md` files in `team-knowledge/` | Domain knowledge, team structure, terminology |
| `writing-style-guide.md` | Team-level voice, formatting, and conventions |

### Shared Skills (`skills/`)

| File | Purpose |
|------|---------|
| `product-why-first.skill.md` | Five-layer analysis for separating problems from solutions |
| `idea-triage.skill.md` | Structured workflow for triaging ideas before spec investment |

### Saved Output

Triage output is saved to `team-knowledge/ideas/<idea-slug>-<date>.md` with status `untested`. When validation is complete and signal is positive, this file becomes the brief handed to the Spec Writer.

---

## Changelog
- v1.0.1 (2026-03-08): Phase 1 now requires one question to propose 1–2 problem interpretations and ask which is closer. Prevents triaging the wrong version of an idea.
- v1.0.0 (2026-03-08): Initial version. Phases: Clarify → Triage → Validate → Save → Feedback.
