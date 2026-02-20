# Writing Style Guide

Extracted from the Intelligent Monitors spec, Detection Scopes spec, and Extensible Monitors proposal. The agent should internalize these patterns — not copy them verbatim.

## Voice & Tone
- **Direct, outcome-focused, executive-ready.** Short sentences, action verbs, minimal jargon.
- **Bold key terms at first mention** (e.g., **Intelligent Monitors**, **Noise Tolerance**, **What-If Preview**).
- Prefer "services get X" over "we will build X" — always customer-first framing.
- Avoid hedging language ("might", "could potentially") — be precise about what is and isn't in scope.

## TL;DR Pattern
Use a transformation statement: *from X to Y*.
> Intelligent Monitors unify Brain's fragmented per-SLI/per-model approach into a single, AI-driven monitor — transforming the experience from *"one monitor per SLI × model with manual tuning"* to *"one intelligent monitor that Brain auto-tunes across your signals."*

## "The Ask" Section
Always be specific: name the teams, the timeline, and the pilot scope.
> - Cross-team engineering investment: AI Experiences (UX), AI Monitoring-Pipeline (config), AI Monitoring-Actions (detection), AI Models (OPM integration)
> - Partnership with 3-5 pilot services for V1 validation by end of March 2026
> - Leadership support for IM as the default monitor paradigm by Fall 2026

## Hypothesis Format
Structure as: If we do X for Y, then metric Z will move by P, because data/research showed ABC.
> If we build a unified, extensible Brain detection offering that automatically ingests all service signals and enables scenario-based detection with minimal configuration, then we will reduce missed outages, accelerate onboarding, and improve user satisfaction.

## Problem Framing
- **Bold lead phrases** that name the pain point (e.g., **Getting to outage mode is hard**, **High coverage requires manual support**).
- Tie every problem to a specific scenario from the Users & Scenarios section.
- Use evidence: customer messages, telemetry data, incident counts, support ticket volumes.
- Separate External (Customer/DRI) pain from Internal (Brain/Ops) pain.

## Table Formats Used Across Specs
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

## Goals vs. Features
- Goals describe **what the customer wants** (outcomes), not what we build (features).
- Map every P0/P1 goal to a success metric with baseline → target → owner.
- Features go in the Capabilities section, sorted by priority.

## Appendix Conventions
- Always include a **Definitions** table with canonical terms.
- Use conceptual diagrams (ASCII or Mermaid) for architecture and data flow.
- Include config schema examples (YAML) when applicable.
- Link to related documents, ADO work items, and prototypes.
