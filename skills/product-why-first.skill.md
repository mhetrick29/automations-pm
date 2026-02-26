# Skill: Product Why-First Thinking

## When to Use

Activate this skill whenever the agent needs to:

- **Analyze a brain dump** — before structuring raw thinking, separate stated solutions from underlying problems
- **Review feature requests or proposals** — probe for the root cause behind what's being asked for
- **Write or review a PRD / spec / strategy doc** — ensure the problem statement is a root cause, not a symptom
- **Evaluate roadmap items or prioritization decisions** — check that each item connects to real user value
- **Analyze user research** — map stated wants to underlying needs (complements `interview-analysis.skill.md`)

This skill also activates when a user:
- Dumps a list of feature ideas and asks you to structure them
- Asks "should we build X?" or "is this the right approach?"
- Provides rough notes that mix problems and solutions

---

## Core Principle

**We deliver value, not features.** Every solution must:
1. Solve a user's underlying problem — not just their stated request
2. Connect to the product's value proposition and mission
3. Address the root cause, not symptoms

---

## The Five-Layer Analysis

For any user statement, feature request, brain dump content, or product proposal, work through these layers:

### Layer 1: Surface the Stated Solution

**What is the user/stakeholder explicitly asking for?**
- Capture their exact words and framing
- Note: this is often a solution they've invented, not the actual need

### Layer 2: Excavate the Underlying Problem

**Why do they want that? What pain, friction, or goal is driving this?**

Look for these signals:
- **Workarounds** — What do they do when the product fails them?
- **Time spent** — Where are they losing hours or effort?
- **Emotional language** — Frustration, delight, anxiety, relief
- **Frequency** — How often does this come up?
- **Current behavior** — What do they do today without your product?
- **Job-to-be-done** — What outcome are they hiring your product to achieve?

### Layer 3: Validate the Root Cause

**Is this the actual problem or a symptom of something deeper?**

Ask "why" repeatedly (five-whys method):
- User wants automated reports → Why? → Manual reports take too long → Why? → They rebuild the same queries weekly → Why? → No way to save query templates → **Root cause: lack of reusability in the system**

Watch for:
- **Problem chains** — where one issue cascades into others
- **Systemic issues** — problems that affect multiple workflows
- **Hidden costs** — downstream impacts the user hasn't articulated

### Layer 4: Connect to Product Value Proposition

**How does solving this root cause ladder up to the product's mission and value?**

For every proposed solution, validate:
- What metric or outcome does this move?
- Who benefits and how much?
- Does this advance the product's strategic direction or just add surface area?

### Layer 5: Test Solution Fit

**Does the proposed solution actually address the root cause?**

Challenge the solution:
- Will this solve the problem or just treat symptoms?
- Are there simpler ways to achieve the same outcome?
- What are we trading off by building this?
- What could we build instead that solves the root cause better?

---

## Red Flags

These patterns suggest we're not at the root cause yet:

- **"Users want faster horses"** — They're stating solutions, not problems
- **Feature parity requests** — "Competitor X has this" without understanding why it matters
- **One-off asks** — Solving for a single user's unique situation
- **Buzzword-driven** — "We need AI" without a clear problem
- **Internal politics** — Requests driven by what execs want to see, not user needs
- **"Nice to have"** — No clear pain point articulated

---

## Output Formats by Context

### When analyzing brain dump content

After running the five layers on key ideas in the dump, surface findings as part of your synthesis:

- **Problem/solution confusion** — where the dump states solutions without grounding them in problems. Flag these so the structured output leads with the *why*.
- **Root cause opportunities** — where multiple stated needs trace back to the same underlying problem. Group them.
- **Ungrounded proposals** — ideas that don't connect to user pain or product value. Mark as `[OPEN: why does this matter?]`.

### When reviewing feature requests or proposals

```
Request: [What was asked for]
Underlying problem: [Root cause after excavation]
Value alignment: [Connection to product mission]
Solution assessment: [Does the request solve the root cause?]
Recommendation: [Build as requested / Modify / Alternative approach / Don't build]
Reasoning: [Why]
```

### When writing or reviewing specs

Inline application — ensure:
1. The problem statement is a root cause, not a symptom
2. Every P0 feature traces to an excavated problem, not a stated request
3. Metrics measure problem resolution, not feature delivery
4. The "why" is stated before the "what" in every section

---

## Example

**Stated request:** "I wish I could customize the detection threshold for my service."

| Layer | Finding |
|-------|---------|
| **Stated solution** | Customizable detection threshold |
| **Underlying problem** | Current threshold creates false positives for their service's normal behavior |
| **Root cause** | Detection model trained on general telemetry doesn't account for service-specific baselines |
| **Value connection** | Improving detection accuracy is core to reducing noise and focusing on real incidents |
| **Solution fit** | Instead of manual threshold tuning (high maintenance, doesn't scale), build service-specific baseline learning. Users get accuracy without configuration burden. |

**Result:** We solve the real problem (false positives) in a way that aligns with the platform vision (intelligent, automated detection) rather than adding a configuration knob that shifts work to users.

---

## Key Reminders

- **Challenge respectfully** — question the "what" while honoring the user's experience of the problem
- **Stay curious** — keep asking "why" until you hit bedrock
- **Connect to mission** — every solution should ladder up to product value
- **Solve root causes** — surface requests are often symptoms
- **Think systematically** — one user's workaround might reveal a platform gap
