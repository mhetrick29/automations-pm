# Skill: Multi-Lens Analysis

## When to Use

Invoke this skill when an agent needs to produce a high-quality analysis, recommendation, or strategic answer — especially when:

- The question has multiple valid approaches and anchoring on one framing too early would lose alternatives
- The user is making a decision that's hard to reverse (architecture, strategy, process change, org proposal)
- The output will be shared with stakeholders or used to drive action
- The agent's first-pass answer feels "good but not great" — it covers one angle well but may be missing something
- The user explicitly asks for a thorough or multi-perspective analysis

Do NOT invoke for:
- Simple factual lookups or status checks
- Mechanical tasks (file edits, commits, searches)
- Questions with a single clear answer

---

## Core Idea

One analysis pass anchors on one framing — and you lose the alternatives. Running the same question through 2-3 distinct personas forces different aspects to surface. The synthesis step then picks the best parts from each, producing an answer that no single pass would have reached.

This mirrors how good thinking actually works: you argue with yourself from different angles before committing.

---

## Workflow

### Step 1 — Select Lenses

Choose 2-3 lenses based on the nature of the question. Default set (override when context demands it):

| Lens | Perspective | Anchors on |
|------|-------------|------------|
| **User Advocate** | "How does this feel to the person using it?" | Friction, workflows, trust, adoption barriers, unspoken expectations |
| **Strategist** | "How does this fit the bigger picture?" | Tradeoffs, second-order effects, what this enables or closes off, org dynamics |
| **Pragmatist** | "What actually ships and works?" | Constraints, dependencies, sequencing, overhead, what breaks, what's simplest |

Alternative lenses (use when relevant):
| Lens | When to use |
|------|-------------|
| **Skeptic** | When the idea feels too clean — probe for hidden costs, failure modes, things nobody's saying |
| **Customer's Customer** | When the user of your product serves their own users — think one level deeper |
| **Operator** | When the question involves running/maintaining something long-term — toil, alerts, on-call, upgrade paths |
| **Data Scientist** | When the question involves measurement, experimentation, or evidence — what would we actually measure, how would we know |

If unsure which lenses fit, default to the top 3 (User Advocate, Strategist, Pragmatist).

### Step 2 — Run Passes

For each selected lens, analyze the question independently. Each pass should:

1. **State the lens** — one line: "Analyzing as [Lens Name]: [what this lens focuses on]"
2. **Give the answer from that perspective** — not a summary of the question, but an actual position. What would someone with this perspective recommend and why?
3. **Surface what the other lenses might miss** — the unique contribution of this viewpoint
4. **Flag risks or blindspots visible from this angle**

Rules:
- Each pass should be **2-4 paragraphs**, not exhaustive essays
- Passes should genuinely disagree where the question warrants it — don't force consensus
- Don't reference the other lenses during a pass ("unlike the Strategist...") — each pass stands alone
- Use concrete examples from the domain, not abstract principles

### Step 3 — Synthesize

After all passes, produce a synthesis that:

1. **Identifies convergence** — where 2+ lenses agree, that signal is strong
2. **Names the real tensions** — where lenses disagree, state the tradeoff clearly rather than picking a side prematurely
3. **Pulls the best framing from each** — the synthesis should contain ideas or framings that appeared in individual passes but not in all of them
4. **Produces a recommendation** — a clear position, not a "it depends." State what you'd do and why, acknowledging what you're trading off
5. **Lists 1-2 things that would change the answer** — what new information or context would flip the recommendation?

### Step 4 — Present to User

Output format:

```
## Multi-Lens Analysis: [topic]

### Lens 1: [Name]
[analysis]

### Lens 2: [Name]
[analysis]

### Lens 3: [Name]
[analysis]

---

### Synthesis
[convergence, tensions, recommendation]

### What would change this answer
- [condition 1]
- [condition 2]
```

If the user asked a simple question and got a multi-lens analysis, it should still feel proportionate. For lighter questions, the passes can be 1-2 sentences each and the synthesis can be a single paragraph.

---

## Integration with Other Skills

- **product-why-first.skill.md** — the User Advocate lens should apply Layer 2-3 (excavate problem, validate root cause) naturally. Don't re-invoke the full skill unless the question is specifically about feature/problem analysis.
- **idea-triage.skill.md** — when triaging ideas, multi-lens can replace or enhance Step 2 (alignment check). Run the lenses on the key assumption, not the whole idea.
- **Spec Writer brainstorm** — the devil's advocate phase already does single-lens probing per topic. Multi-lens is most valuable for the synthesis/recommendation moments, not every individual probe.

---

## Guardrails

- **Don't use this for everything.** It adds depth but also length. Use it when the question warrants multiple perspectives, not for routine tasks.
- **Passes must genuinely differ.** If all 3 lenses say the same thing, either the question doesn't need multi-lens or you picked the wrong lenses. Say so and give the straightforward answer.
- **The synthesis must take a position.** "All perspectives have merit" is not a synthesis — it's a dodge. State what you'd recommend and why.
- **Keep it proportionate.** A quick strategic question gets 1-2 sentence passes and a short synthesis. A major architecture decision gets full paragraphs. Match the weight of the analysis to the weight of the decision.
- **Don't narrate the process.** Don't say "I'm now going to run a multi-lens analysis." Just do it. The output format makes the structure clear.
