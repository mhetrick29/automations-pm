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

## Appendix Conventions

- Always include a **Definitions** table with canonical terms.
- Use conceptual diagrams (ASCII or Mermaid) for architecture and data flow.
- Include config schema examples (YAML) when applicable.
- Link to related documents, ADO work items, and prototypes.
