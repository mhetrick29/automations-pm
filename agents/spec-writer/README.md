# Spec Writer Agent (Brain • AIOps)

Generate **VP-ready one-pagers** and **full product specs** from a short brief, notes, or links.

## Quick Start (CLI)

```bash
# One-pager then full spec
copilot agents run -f agents/spec-writer/spec-writer-agent.md "Draft a one-pager + full spec for <capability>; include success metrics and rollout."

# Brainstorm mode
copilot agents run -f agents/spec-writer/spec-writer-agent.md "Let's brainstorm an epic for <topic>"

# System prompt directly
copilot chat -s agents/spec-writer/spec-writer-agent.system.md -p "Turn these notes into a one-pager and full spec in our house style: <paste notes>"
```

## Folder Structure

```
agents/spec-writer/
  spec-writer-agent.md            # Agent card + metadata
  spec-writer-agent.system.md     # System prompt
  knowledge/
    review-checklist.md           # 18-item post-draft quality checklist
    templates/
      Unified_Spec_Template.md    # Full spec template with guidance
      Epic-Spec-Template.md       # Epic spec template (ADO-oriented)
    content-samples/
      Intelligent-Monitors-Epic-Spec-Example.md   # Completed epic spec example
      Proposal_for_extensible_monitors.md          # Reference spec (voice/content)
      Supporting_custom_detection_scopes_in_the_Brain_product.md  # Reference spec (voice/content)
```

Note: `team-knowledge/` (shared product context, domain model, writing style) lives at the repo root and is loaded by all agents. See the root README.

## Key Workflows

### Full Spec
The agent produces an Executive One-Pager, then expands to a Full Spec following the Unified Spec Template, ending with a Review Checklist.

### Epic Spec
When asked for an epic spec, the agent: (1) produces a full spec first, (2) distills it into an epic spec matching the Epic-Spec-Template, using the Intelligent Monitors example as a reference.

### Brainstorm Mode
When triggered with phrases like "let's brainstorm", "brainstorm epic", or "spec brainstorm", the agent enters an interactive mode — asking structured questions to surface requirements before drafting anything. Use this for early-stage work where the problem space isn't fully defined.

### Product Context
Before generating, the agent checks for SharePoint updates to `team-knowledge/` via `tools/fetch-knowledge.js`, then reads product context to ground specs in current vision and priorities.
