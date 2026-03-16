# Skill: Idea Triage

## When to Use

Invoke this skill when any agent needs to assess whether an idea is worth pursuing before committing resources to spec-writing, prototyping, or user research.

Activate when:
- A user presents a raw feature idea, "shower thought", or half-formed concept
- An agent is about to hand off to the Spec Writer but has not verified the idea has been triaged
- A brainstorm session produces candidate ideas that need filtering before proceeding
- The user asks "should we build this?" or "is this worth pursuing?"

Do NOT skip triage and go straight to spec. Ideas that haven't been triaged produce speculative specs.

---

## Inputs

- **Raw idea text** — verbatim from the user; don't paraphrase before analyzing
- **Optional context** — who the user is, what problem they described, any constraints mentioned

---

## Workflow

### Step 1 — Extract Core Elements

From the raw idea, identify:
- **Core behavior change** — what would a user do differently if this existed?
- **Simplest interaction loop** — what is the minimum back-and-forth that delivers value?
- **Key assumption** — what must be true about user behavior or the problem for this to work?

If the key assumption cannot be articulated clearly, flag the idea as **underspecified** and prompt for one more clarifying question before continuing.

### Step 2 — Check Alignment and Strategic Leverage

Load `team-knowledge/product-context/` and apply a fast check:
- Is this solving a symptom or a root cause? (use `skills/product-why-first.skill.md` Layer 2–3)
- Does this align with current product priorities?
- Is there a simpler version that tests the same assumption?

Then assess **strategic leverage** — what this idea unlocks beyond the feature itself:
- Can we put this on the website? Use it in competitive positioning?
- Does it unlock a new segment, vertical, or deal type?
- Does it accelerate adoption, improve attach rate, or create GTM leverage?
- Is this unique product thinking, or are we replicating what exists?

If the idea has no clear leverage beyond "it's a nice feature," flag that — it doesn't kill the idea, but it changes the appetite conversation.

If the idea is misaligned or too broad, say so directly. Propose a scoped-down version before generating validation approaches.

### Step 3 — Identify the Scoped-Down Version

For any idea that is too broad or speculative, define the minimum version:
- What is the smallest interaction that still tests the key assumption?
- What can be cut without invalidating the test?
- What form could this take that requires no engineering? (AI prompt, paper prototype, conversation)

### Step 4 — Generate Validation Approaches

Produce 3–5 lightweight validation approaches. For each:

| Field | Description |
|-------|-------------|
| **Name** | Short, descriptive label |
| **Format** | What form it takes (AI chat prompt, paper prototype, dogfood, user interview, API mockup, etc.) |
| **How it works** | 2–3 sentences on the interaction |
| **What it tests** | The specific assumption this approach validates |
| **Effort** | Time to set up (target: 5 min – 2 hours) |
| **Success signal** | Concrete signal that it's working |
| **Ready-to-use prompt** | Complete, pasteable prompt (for AI-based approaches) |

Variation requirements:
- At least one approach must be **minimal** (absurdly simple, no setup)
- At least one should **stretch the concept** in a different direction
- At least one should **run passively** or not require the user to initiate
- Approaches should be adapted for a **PM context** (prefer "dogfood with one service team" or "review with one engineer" over "test on myself")

End with a recommendation: which approach to try first (the simplest one that tests the key assumption).

### Step 5 — Produce Triage Summary

Output:

```
## Triage Summary: [idea name]
**Core behavior change:** [what users would do differently]
**Simplest interaction loop:** [minimum back-and-forth that delivers value]
**Key assumption:** [what must be true for this to work]

**Product-why-first assessment:**
- Root cause vs. symptom: [finding]
- Alignment with priorities: [finding]
- Minimum testable version: [scoped description]

**Strategic leverage:**
- Beyond the feature: [what this unlocks — GTM, competitive, segment, adoption]

**Status:** untested
```

### Step 6 — Save Output

Save to `ideas/<idea-slug>-<date>.md` including:
- Raw idea (verbatim)
- Triage summary
- Product-why-first assessment
- All validation approaches with prompts
- Status: `untested`

Do not proceed to spec or prototype until status is updated to `validated`.

### Step 7 — Capture Feedback

At the end of the session, ask:
> "One quick question before we close: was this triage useful? Anything you'd want done differently — questions I skipped, assumptions I missed, validation approaches that felt off?"

Append response verbatim to `agents/idea-triage/feedback.md`:

```
## [date] — [idea-slug]
**What worked:** [user's words or "no feedback"]
**What to improve:** [user's words or "no feedback"]
```

---

## Guardrails

- **Never generate a spec or prototype before triage is complete.** If another agent calls this skill, it must wait for the triage summary before proceeding.
- **Always surface the key assumption explicitly.** If it can't be articulated, flag the idea as underspecified and stop.
- **Validation approaches must be completable in under 2 hours.** No "run a 3-month pilot" approaches.
- **Save output to `ideas/` before closing.** Do not produce validation approaches without saving the triage file.
- **Always capture feedback at the end** — one question, verbatim capture, appended to `agents/idea-triage/feedback.md`.
- **Do not hand off to the Spec Writer automatically.** The user must return with validation results and explicitly request a handoff.
