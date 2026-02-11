# Spec Writer Agent (Brain • AIOps)

Generate **VP‑ready one‑pagers** and **full product specs** from a short brief, notes, or links.

## Files
- `spec-writer-agent.md` — Agent card + metadata + knowledge links
- `agent.system.md` — System prompt for generation behavior
- `knowledge/templates/Unified_Spec_Template.md` — your local template (place/rename as needed)

## Quick Start (CLI)
```bash
# One‑pager then full spec
copilot agents run -f agents/spec-writer/spec-writer-agent.md "Draft a one‑pager + full spec for <capability>; include success metrics and rollout."

# Use system prompt directly
copilot chat -s agents/spec-writer/agent.system.md -p "Turn these notes into a one‑pager and full spec in our house style: <paste notes>"
```

## Add your prior specs as knowledge
- Add SharePoint/OneDrive links under `knowledge.sharepoint` in `spec-writer-agent.md`.
- Keep local exemplars in `knowledge/` (optional).

## Suggested Prompts
- “Write an **executive summary** for <initiative>, then expand to full spec using Unified Spec Template style.”
- “Given these two options, produce a **Decision Log** and recommend one with tradeoffs.”

## Folder Structure
```
agents/
  spec-writer/
    spec-writer-agent.md
    agent.system.md
    README.md
    knowledge/
      templates/
        Product-Spec-Template.md
```
