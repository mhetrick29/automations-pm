# Intelligent Monitors — Epic Spec Example

> **Purpose of this file:** A completed epic spec distilled from the full Intelligent Monitors spec. Use this as a concrete reference when producing epic specs — it follows the `Epic-Spec-Template.md` structure exactly.

---

# AIOps Epic

**Epic ID & Name:** 34640109 — Intelligent Monitors  **Author:** Matthew Hetrick  **Status:** Draft  **Last Updated:** 2026-02-10

## Overview

### Elevator Pitch / Narrative

Brain monitors are fragmented across per-SLI, per-model configurations that create friction for service teams — getting to outage mode is hard, high coverage requires manual support, and every new detection model requires a new monitor type. Intelligent Monitors unify this into a single, AI-driven monitor that auto-selects models, provides what-if previews, and lets services confidently enable detection with minimal configuration.

> If we build a unified, extensible monitor that automatically ingests all service signals and enables scenario-based detection with minimal configuration, then we will reduce median time-to-outage-mode by 50% and achieve ≥80% self-service enablement, because current data shows ~15% of outages are detected but manually declared due to low confidence in Brain's automated decisions.

### Customers / Users

**Primary — Service Teams:** DRIs (on-call engineers) who need reliable detection without constant tuning; Service Owners/SRE Leads accountable for Brain coverage and precision; Config Admins who manage Brain monitor setup and want consistent configuration.

**Secondary — Internal (Brain):** Brain Product Team (needs to ship new detection capabilities without new monitor paradigms); Brain Support (needs reduced tuning request volume); Brain Platform Team (needs extensible architecture for new models).

### Customer Problems and Insights

- **Getting to outage mode is hard.** Many monitors stall in escrow; services require manual support to progress through enablement. Evidence: significant eng hours spent by SRE & Brain teams working with services manually.
- **Lack of confidence in detection.** Customers hesitate to enable outage mode without understanding what Brain will do. ~15% of outages are detected but manually declared.
- **High tuning support burden.** ~30% of support requests relate to detection/monitor configuration. Each FN takes ~3 days, each FP ~2 days — per monitor, per service.
- **Monitor overload.** Services with 5+ SLIs must manage 5+ monitors with different parameters per model. Innovation is constrained since every new model requires a new monitor type + new UX + new params.

## Goals & Features

### Goals

| No. | Goal | Priority |
|-----|------|----------|
| 1 | Services can confidently enable outage mode without engineering support | P1 |
| 2 | Reduce time from SLI onboarding to outage mode by 50%+ | P1 |
| 3 | Services gain visibility into detection behavior before enabling | P1 |
| 4 | New detection models integrate without customer-facing monitor changes | P2 |
| 5 | Multi-signal detection improves precision over single-SLI monitoring | P2 |

### Non-Goals

| No. | Non-Goal |
|-----|----------|
| 1 | Deprecating single-SLI monitors in V1 — existing monitors continue; migration comes later |
| 2 | Building chat-based configuration in V1 — natural language config is V3+ exploration |
| 3 | Supporting non-SLI signals in V1 — external signals are a separate workstream (Brain Skills) |
| 4 | Building custom detection logic — services needing custom rules should use Brain Skills framework |

### Features

| No. | Feature | Target Milestone | Priority |
|-----|---------|------------------|----------|
| 1 | Out-of-the-box Intelligent Monitor using all quality SLIs | V1 (March 2026) | P1 |
| 2 | What-if preview of detection results over historical data | V1 (March 2026) | P1 |
| 3 | Noise tolerance slider with live preview impact | V1 (March 2026) | P1 |
| 4 | Unified policy configuration (IcM team, severity, outage mode) | V1 (March 2026) | P1 |
| 5 | Scope selection for detection | V1 (March 2026) | P1 |
| 6 | Detection results table with explanations | V2 (June 2026) | P2 |
| 7 | SLI quality insights and recommendations | V2 (June 2026) | P2 |
| 8 | Config-as-code for IM settings | V2 (June 2026) | P2 |
| 9 | Auto-tuning via FP/FN feedback loop | V3+ (Fall 2026) | P3 |
| 10 | Chat-based Q&A and configuration | V3+ (Fall 2026) | P3 |

## Definition of Success

### Success Metrics

| No. | Type (Biz / Cust / Tech) | Outcome | Metric | Priority |
|-----|--------------------------|---------|--------|----------|
| 1 | Biz | Lower support cost | ≥40% reduction in detection-related support tickets by Sept 2026 | P1 |
| 2 | Cust | Faster onboarding | Median time-to-outage-mode ≤2 weeks (from ~4 weeks) by June 2026 | P1 |
| 3 | Cust | Self-service enablement | ≥80% of new monitors enabled without eng support by June 2026 | P1 |
| 4 | Cust | Confidence in detection | 100% of IM-enabled services use what-if preview at least once | P1 |
| 5 | Tech | Improved precision | +10pp precision for multi-signal services vs single-SLI by Sept 2026 | P2 |
| 6 | Tech | Extensible architecture | New models deployable without new monitor types | P2 |

> **Discussion Note:**
> P1 should be treated as "Must Have". P0 is reserved for rare, service-blocking scenarios.

### Contributing Teams / Collaborators

| No. | Requirement or Deliverable | Producing Team |
|-----|----------------------------|----------------|
| 1 | IM configuration UX, what-if preview, detection results table | AI Experiences |
| 2 | IM config schema, config-as-code support, policy storage | AI Monitoring-Pipeline |
| 3 | Detection evaluation using IM settings, multi-model orchestration | AI Monitoring-Actions |
| 4 | Backtesting/simulation service for what-if preview | AI Platform |
| 5 | OPM integration with IM settings, SLI quality insights API | AI Models |
