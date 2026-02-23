# Custom Scopes

Close the structural gaps left after the Custom Scopes launch (end of 2025) to transform custom scopes from a limited pilot into a fully supported, self-service product capability.

## The Problem

Custom Scopes launched at the end of 2025, letting services declare outages at any scope (scale unit, SI, custom dimension) instead of being locked to region. But the launch left six structural gaps: services don't know what they're configuring, can only use one scope per SLI, are locked to the EB model, can't get pass-through context, edge sites require manual workarounds, and hierarchical SLIs aren't supported. Brain's engineering team absorbs the toil of every custom scope setup manually.

## Pillars

| # | Pillar | Phase | Priority |
|---|--------|-------|----------|
| 1 | Document what scope options customers actually have | Phase 1 | P1 |
| 2 | Multiple scopes per SLI with independent outage criteria | Phase 1 | P1 |
| 3 | Full model coverage and health support at custom scopes | Phase 2 | P1 |
| 4 | Pass-through — detect at one scope, surface context from another | Phase 2 | P2 |
| 5 | First-class non-Azure authority location support (Edge Sites) | Phase 3 | P2 |
| 6 | Multi-scope hierarchical SLIs | Phase 3 | P2 |

## Status

🟡 **Active** — Epic spec drafted, Phase 1 scoping in progress

## Key Documents

- [Custom Scopes Epic Spec](./docs/Custom%20Scopes%20Epic%20Spec.md) — Full epic spec with goals, features, phasing, and metrics
- [Custom Scopes - Gaps and Direction](./docs/Custom%20Scopes%20-%20Gaps%20and%20Direction.md) — Analysis of the six structural gaps and proposed direction

## Key Customers

AFD, ARM, Service Bus, OpenAI, MDM, BIC, and identity services — all blocked or using workarounds for non-regional scope detection.

## Contributing Teams

| Team | Responsibility |
|------|---------------|
| **AI Models** | OPM custom scope support |
| **AI Experiences** | IM scope selection UX; scope strength indicator |
| **AI Monitoring-Actions** | Detection agent multi-scope evaluation; pass-through pipeline |
| **AI Monitoring-Pipeline** | Multi-scope config schema; health engine; LID schema for edge sites |
| **AI Platform** | OPM execution at custom scopes; pipeline infrastructure |
| **PM** | Scope documentation (Matthew Hetrick) |

## Related Projects

- [Intelligent Monitors](../Intelligent%20Monitors/) — IM GA depends on OPM custom scope support (Goal 5 / Feature 2–3)

## OKRs

See [manifest.yaml](./manifest.yaml) for detailed OKRs and status tracking.
