# Matthew's Writing Style

Personal style patterns applied on top of the team writing style guide. These reflect Matthew's preferred formatting for specs and product documents.

*Last updated: 2026-03-13 — auto-updated from conversation insights*

## Voice & Tone

- **Direct and terse for tasks**: "commit and push", "merge this branch to main", "is workiq running?" — no filler, no pleasantries when giving instructions.
- **Executable task specs**: When delegating implementation work, often provides exact filenames, required prompt text, numbered behaviors, and expected output blocks up front — the request reads like an acceptance test, not a vague ask.
- **Flowing and connective for vision**: When explaining a concept or goal, uses long em-dash-heavy sentences that chain ideas together. Thinks out loud in a stream: *"how input metrics like adoption, onboarding, usage, etc. evolve over time, how they connect to the output metrics such as customer experience, reliability, AIR-O/D, and how we'll set the right inputs during planning."*
- **Product-centric framing**: Defaults to "would a user choose this?" as the quality bar. *"If this were a product people had to choose to use, how would we know they love it, tolerate it, or are frustrated by it?"*
- **Values clarity of purpose**: Frequently closes a thought with why it matters: *"so we all understand what we're driving toward and why it matters."*

## Thinking Patterns

- **Systems thinker**: Sees connections between things, not just the things. Asks "how does X connect to Y?" not just "what is X?" — e.g., input metrics → output metrics → planning decisions.
- **Layered frameworks**: Naturally organizes into tiers, axes, and phases (3-tier metrics, two-axis readiness, V1/V2/V3).
- **Narrative workflows**: Describes processes as stories: *"I take a stroll with my dog & brain dump ideas... I then copy this into the CLI... it outputs structured docs... I review this, do some back and forth til it looks good."*
- **Iteration-first**: Assumes everything gets refined. *"do some back and forth with the agent til it looks good"*, *"a little formatting and revision"*.
- **Evidence-audit mindset**: Frequently asks for verbatim evidence, explicit verification passes, and honest gap analysis rather than optimistic synthesis. Prefers outputs that show the chain from quote -> interpretation -> product implication.
- **Analogy-driven explanation**: Builds rich, extended analogies to explain complex systems — not quick metaphors but full mappings where each component of the system maps to a concrete real-world counterpart, and the analogy extends across the entire value chain (e.g., doctor/patient analogy for Brain where signals = vitals, models = ways of reading vitals, IM = doctor, auto-comms = notifying family, triage = connecting symptoms to root causes, BCH = population health leader).
- **Exit criteria thinking**: Defines phases by entry/exit criteria, not just features. *"The exit criteria for this state is that users can easily set up intelligent monitors and their performance relative to precision/recall and TTO is at parity."*
- **Consolidation instinct**: When thinking gets spread across too many docs, the instinct is to collapse into one cohesive narrative. *"I am starting to have too many docs and I need to consolidate."*
- **Meta-process awareness**: Notices workflow failures and immediately thinks about systemic fixes rather than just solving the immediate problem. *"What updates should I make to my skills and agents based on this convo?"* and *"Don't I have an auto-feedback loop here?"* — treats tools as products that need iteration based on usage data.

## Vocabulary

- Uses **"uplevel"** to mean promote/elevate in hierarchy
- Uses **"crisp"** to mean well-defined and precise (*"gets the spec super crisp"*)
- Uses **"brain dump"** as both noun and verb
- Uses **"back and forth"** for iterative dialogue
- Uses **"the bar"** for quality standards (*"the bar we're aiming for is product-centric"*)
- Uses **"drives"** and **"driving toward"** for goals and metrics
- Uses **"churn"** for ambiguity/rework (*"where the most churn has been felt"*)
- Prefers **"& "** over "and" in casual/conversational context
- Uses **"flush out"** to mean expand with more detail and rigor (*"this needs to be flushed out a little more"*)
- Uses **"uber"** as a prefix for high-level groupings that contain sub-phases (*"uber phase 1"*)
- Uses **"bubble up"** to mean surface or make more prominent (*"we need to make this gap bubble up"*)
- Uses **"land"** to mean ship/establish/deliver (*"we need to land phase 1 first"*)
- Uses **"you alright?"** as a casual check-in when something seems stalled or off — expects a brief status update, not a lengthy explanation

## Conversational Patterns

- **Approval-then-pivot**: Starts with brief positive feedback ("This is great", "I like that", "That was awesome") then immediately pivots to the next instruction or constraint in the same message. The approval is a one-beat acknowledgment, not an invitation to discuss.
- **Statement-as-question**: Drops question marks on simple queries — *"Did you push these"*, *"how would I make this into a plugin"* — treats chat like speech, not formal writing.
- **Typo tolerance**: Doesn't correct casual typos in chat (*"ting"* for *"thing"*) — prioritizes speed over polish in conversational context.
- **Implicit tool shorthand**: References tools by informal names and assumes shared context — *"Use workiq to send myself an email"* not "Use the Work IQ tool to compose an email for me."
- **Confirmation + delegation**: Combines a yes with the next action in one breath — *"yep and then you can plan out the conversion"*, *"Keep those out of the mcp, good catch."*

## Table Formats

| Table Type | Columns |
|------------|---------|
| Personas | Persona \| Description |
| Problems | Problem \| Evidence \| Tied to Scenario |
| Goals | Goal \| Target Metric \| Priority (P0/P1/P2) |
| Success Metrics | Metric \| Baseline \| Target \| By \| Source/Query \| Owner |
| Capabilities | Priority \| Capability \| Customer Usage |
| Key Decisions | Decision \| Options Considered \| Rationale \| Date \| Owner |
| Risks | Risk \| Likelihood \| Impact \| Mitigation |
| Contributing Teams | Requirement or Deliverable \| Producing Team |

## Non-Goals Style

Use bold negation, explain why, and redirect to where it lives:

> - **Not deprecating single-SLI monitors in V1**: Existing monitors continue to work; migration comes later
> - **Not building chat-based configuration in V1**: Natural language config is V3+ exploration

## Phased Delivery (V1 / V2 / V3+)

Each phase gets four sub-sections:
1. **Summary** — 2-3 sentence overview of the release
2. **Customer gets** — bulleted list of capabilities delivered
3. **Problems solved** — connect capabilities back to the problems section with brief explanations
4. **Success criteria** — phase-specific, measurable outcomes tied to success metrics

## Metrics Structure

Always separate metrics into three tiers:

1. **Input metrics** (what we control — feature delivery): "Shipped by [date]." No baseline/target needed.
2. **Output metrics** (what moves — tracked via telemetry): Full baseline → target → date → owner.
3. **Considered but not primary** (for planning review discussion): List metrics that require a campaign or depend on out-of-scope work to move. Note why they aren't primary. Allows stakeholders to propose promoting them.

## Paradigm Shift Framing

For epics, frame the north star as a transformation statement in the elevator pitch:

> From: *"[current painful state]"*
> To: *"[desired future state]"*

Keep both sides concrete and customer-facing. Avoid implementation language in the "to" state.

## Policy vs. Feature

In the features table, explicitly label policy decisions that don't require engineering work:

> | QCS-only classic monitor carve-out | V1 (Q2 2026) — **Policy** | P1 |

This prevents policy decisions from being tracked as engineering backlog and makes ownership clear.

## Decision Log: Name the Tension

Each decision log entry should acknowledge the tradeoff in the chosen option, not just justify it. Format:

> **Rationale**: [Why this option.] **Tension**: [What this option sacrifices or assumes.]

Example: "Included as stretch to allow delivery if capacity permits. **Tension**: if shipped, leadership should decide whether Geneva integration counts toward the time-to-AOD metric or is tracked separately — it advances the KPI via a side path, not the core product architecture."

## Leadership Flag

When a decision requires leadership input before scoping is locked, call it out explicitly — in the Risks & Open Questions section and in the verbal handoff:

> *"Leadership should decide whether X counts toward [metric] or is tracked separately."*

Don't bury leadership decisions in the decision log. Surface them at the top of the relevant section.

## Appendix Conventions

- Always include a **Definitions** table with canonical terms.
- Use conceptual diagrams (ASCII or Mermaid) for architecture and data flow.
- Include config schema examples (YAML) when applicable.
- Link to related documents, ADO work items, and prototypes.
