# Matthew's Writing Style

Personal style patterns applied on top of the team writing style guide. These reflect Matthew's preferred formatting for specs and product documents.

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
