# User Research Agent

A reusable Copilot agent that plans studies, runs evaluations, and converts findings into **spec-ready UX actions** with clear **severity/confidence** scoring and **traceability**.

## Files
- `user-research-agent.md` — Agent card with metadata, templates, rubrics, and usage prompts.
- `agent.system.md` — System prompt that governs the agent’s behavior.

## Prerequisites
- Copilot CLI (or your org’s Copilot runtime) installed and configured.
- Access to your repository or working directory with these files checked in.

## Quick Start (CLI)
```bash
# Option A: Run inline with a prompt
copilot agents run -f user-research-agent.md "Draft a 45-minute moderated test plan and script for the prototype at <figma_link>. Include success metrics and a severity rubric."

# Option B: Use the system prompt explicitly
copilot chat -s agent.system.md -p "Turn these notes into a Findings → Actions table and write the User Experience section for my spec."
```

## Typical Workflows
1. **Plan a study**
   - Prompt: *"Create a research plan to evaluate the alert triage flow for on-call SREs; include hypotheses, recruiting screeners, and a 45m moderated script."*
2. **Synthesize notes → actions**
   - Paste notes or transcripts. Ask: *"Summarize, score severity & confidence, propose UX changes, and generate spec inserts."*
3. **JTBD framing**
   - Prompt: *"Draft a JTBD canvas for a PM diagnosing an availability loss in <cloud/region> at 3am."*

## Customization
- Update authors/owners in the front matter of `user-research-agent.md`.
- Add your preferred principles and guardrails.
- Extend the **Findings → Actions** table with org-specific fields (e.g., OKR, KR, PR link).

## Folder Structure (suggested)
```
agents/
  user-research/
    user-research-agent.md
    agent.system.md
    README.md
```

## Tips
- Keep raw evidence links near the findings (screenshots, logs, recordings).
- Tag artifacts with study IDs and export insights to your backlog.
- When confidence is weak, request a rapid validation plan from the agent before shipping changes.
