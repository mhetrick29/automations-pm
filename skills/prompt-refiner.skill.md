# Skill: Prompt Refiner

## When to Use

Invoke this skill when an agent wants to improve its own system prompt based on accumulated feedback. Any agent can invoke it for itself or another agent.

Activate when the user says:
- "refine your prompt"
- "improve based on feedback"
- "update your instructions"
- "your prompts need work"
- "learn from past sessions"

Also activated by PM Lead when routing a maintenance request to improve agent behavior.

---

## Inputs

- **`feedback.md` path** — path to the feedback log for the target agent (e.g., `agents/spec-writer/feedback.md`)
- **`system.md` path** — path to the target agent's system prompt (e.g., `agents/spec-writer/spec-writer-agent.system.md`)

---

## Workflow

### Step 1 — Read All Feedback

Read the full contents of `feedback.md` for the target agent. Do not skip entries — patterns emerge from the full picture.

### Step 2 — Identify Patterns

Analyze entries and identify:
- **Recurring complaints** — issues that appear in 2+ entries
- **Missing behaviors** — things users wanted that the agent didn't do
- **Quality issues** — consistent gaps in output quality
- **One-off feedback** — note these but do not act on them unless they point to a clear structural flaw

Ignore one-off feedback unless it's obviously and clearly broken (e.g., "the agent hallucinated a quote").

### Step 3 — Map to Specific System Prompt Sections

For each pattern identified, locate the specific section of the system prompt it relates to. If feedback says "you asked too many questions," find the clarification phase rules. If it says "validation approaches weren't actionable," find the validation approach generation rules.

### Step 4 — Propose Minimal, Targeted Edits

Propose specific, minimal edits — do not rewrite sections wholesale. Show each proposed change as a diff:

```
### [Section Name]

**Current:**
[exact current text]

**Proposed:**
[exact proposed replacement]

**Driven by:** [feedback entries that motivated this change — use entry dates/slugs]
```

If feedback is contradictory (e.g., one user wants more questions, another wants fewer), flag the tension explicitly:

> "Feedback conflict: [entry A] wants more clarifying questions; [entry B] wants fewer. Which should take priority?"

Wait for user decision before proposing a resolution.

### Step 5 — Show All Diffs Before Applying

Present all proposed edits together before writing anything. Tell the user:

> "Here are [N] proposed edits. I'll apply all of them if you approve, or you can tell me which ones to keep or skip."

**Never apply changes without showing the diff and getting explicit approval.**

### Step 6 — Apply After Approval

Once the user approves (explicitly — "yes", "apply", "looks good"), write the changes to the system prompt file. Make only the approved edits — nothing else.

### Step 7 — Log the Maintenance Entry

After applying changes, append a maintenance entry to the agent's `feedback.md`:

```
## [date] — PROMPT UPDATED
**Changes made:** [brief summary of what was changed]
**Feedback addressed:** [entry dates/slugs that drove each change]
```

---

## Guardrails

- **Never rewrite a system prompt wholesale.** Only make targeted edits to sections the feedback directly targets.
- **Never apply changes without showing the diff and getting approval.** Not even small changes.
- **If feedback is contradictory, flag the tension and ask the user to decide.** Do not pick a side silently.
- **Preserve the agent's core mission and tone.** Feedback refines behavior — it does not redefine purpose. If a proposed edit would change what the agent fundamentally does, flag it and ask for confirmation.
- **Minimum pattern threshold is 2+ entries**, unless the feedback points to a clear structural flaw. Single-entry feedback shapes future behavior, not current prompts.
- **Do not make changes the user didn't ask for.** While reading the system prompt, you may notice other issues — note them if significant, but don't include them in the proposed edits unless asked.
