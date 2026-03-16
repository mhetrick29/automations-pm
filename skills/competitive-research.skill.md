# Skill: Competitive Research

## When to Use

Invoke this skill when any agent needs structured competitive intelligence to inform product decisions.

Activate when:
- Scoping a new feature and need to understand how other platforms solve the same job
- Writing a spec that needs competitive context (what exists, what's table-stakes, what's differentiated)
- A user asks "how do competitors handle this?" or "what's the market doing here?"
- The product-shaping pipeline reaches the research phase and competitive analysis is selected

Do NOT use for:
- Internal codebase auditing (use system tools directly)
- Customer evidence analysis (use `skills/interview-analysis.skill.md` or `skills/customer-requirements-analysis.skill.md`)

---

## Inputs

- **Problem framing** — the JTBD, problem statement, or feature area to research (from triage or user description)
- **Competitor list** — explicit list from the user, or ask the user to confirm a proposed list
- **Search keywords** — agreed keyword list from keyword alignment step (if available)
- **Evaluation lens** — what aspects matter most? (e.g., API design, UX flow, pricing model, integration patterns, data model)

---

## Workflow

### Step 1 — Scope the Research

Before launching research, align with the user on:

1. **Which competitors to research.** Propose 4–8 platforms based on the problem framing. Include:
   - Direct competitors (solve the same job for the same customer)
   - Adjacent platforms (solve a related job or serve a related segment)
   - Best-in-class from other domains (platforms known for solving this type of problem well, even if in a different industry)
2. **What to evaluate.** Propose 3–5 evaluation dimensions based on the problem. Examples:
   - How they model the core entity/concept
   - User-facing workflow (steps, friction, automation)
   - API surface and extensibility
   - Pricing/packaging of this capability
   - Integration patterns with third-party systems
3. **Confirm with user before proceeding.** Don't launch research without agreement on scope.

### Step 2 — Research Each Competitor

For each competitor, investigate using web search and documentation:
- 3–5 targeted web searches per platform
- 2–4 documentation page reads (API docs, product pages, help articles)
- Review site summaries (G2, Capterra) as fallback if detailed docs are unavailable

**Write each competitor's findings to a standalone file:** `research/{platform-slug}.md`

Each file follows this structure:

```markdown
# {Platform Name} — Competitive Research

**Date:** {date}
**Problem area:** {problem framing from Step 1}

## How They Solve This

[2–3 paragraphs: what the product does, how the user interacts with it, what the mental model is]

## Strengths

- [Specific strength with evidence — link or quote from docs]
- [...]

## Weaknesses / Gaps

- [What's missing, clunky, or poorly reviewed — evidence from reviews or docs]
- [...]

## Notable Design Decisions

- [Interesting choices: how they model data, what they expose via API, what they hide]
- [...]

## Relevance to Our Problem

[1–2 paragraphs: what we can learn from this platform's approach, what to avoid, how it maps to our constraints]
```

**Launch research agents in parallel** if your tool supports background agents. Give each agent the full problem framing from Step 1 so they search with the right lens.

### Step 3 — Synthesize

After all competitor research files are written, produce `research/best-practices.md`:

```markdown
# Competitive Best Practices — {Problem Area}

**Date:** {date}
**Platforms researched:** {list}

## Patterns (What the Best Platforms Do)

| Pattern | Who Does It | Why It Works |
|---------|-------------|--------------|
| [pattern] | [platforms] | [explanation] |

## Anti-Patterns (What to Avoid)

| Anti-Pattern | Who Does It | Why It Fails |
|--------------|-------------|--------------|
| [anti-pattern] | [platforms] | [explanation] |

## Open Questions This Raises

- [Question the research surfaced that our design needs to resolve]
- [...]

## Table-Stakes vs. Differentiators

**Table-stakes** (every serious platform does this):
- [capability]

**Differentiators** (only 1–2 platforms do this well):
- [capability] — [who and how]

**Whitespace** (nobody does this well):
- [opportunity]

## Recommendation

[2–3 paragraphs: what our design should steal, what to avoid, which competitor's model is closest to what we need and why, where we can differentiate]
```

### Step 4 — Present to User

Don't dump the files — present a concise synthesis:

1. **Key patterns** — what the best platforms do (and what to avoid)
2. **Where we can differentiate** — whitespace and opportunities
3. **Open questions** — design decisions the research surfaced
4. **Recommendation** — which models to borrow from and why

Offer the user access to individual `research/{platform}.md` files for details.

---

## Guardrails

- **Always confirm competitor list and evaluation dimensions before researching.** Don't assume which platforms matter.
- **Write findings to files.** The whole point is persistent, referenceable research — not ephemeral chat messages.
- **Attribute evidence.** Every strength, weakness, and pattern should cite where you found it (doc link, review summary, product page).
- **Have a point of view.** The synthesis must include a recommendation, not just a neutral comparison. Surface what you'd steal, what you'd avoid, and why.
- **Keep it proportionate.** For a small feature, 3–4 competitors and a tight synthesis is enough. For a major investment, go wider (6–8 platforms, deeper docs review).
- **Review sites may block automated fetching.** Use search result snippets as fallback. Don't pretend you read a page you couldn't access.
