# AIOps Epic

**Epic ID & Name:** [TBD — new ADO epic] — Intelligent Monitors: Post-March  **Author:** Matthew Hetrick  **Status:** Draft  **Last Updated:** 2026-02-20

---

## Overview

### Elevator Pitch / Narrative

March delivers the foundation: one IM abstraction, OPM-only, pilot services can see their monitor and label detections. But 671 classic monitors are stuck in Sev3 observed-only mode, most services sit below 30% detection coverage, and the AOD decision-maker still has to wait weeks for production incidents before they trust Brain enough to flip the switch. The post-March arc closes that gap.

Services give Brain their signals and their risk tolerance. Within a 3-day training window, they see a meaningful preview of what Brain would have detected — and they flip to AOD. Brain starts conservatively, declaring only the highest-confidence outages. As it learns from incident labels, it earns more coverage. The paradigm shifts from *"add signals, enable AOD one monitor at a time"* to *"set your risk tolerance once, Brain earns more coverage over time."*

> If we give the AOD decision-maker a preview of detection behavior and a risk tolerance parameter before they flip, then services will go from signal onboarding to AOD within 3 days (down from 6+ weeks at P50), because research shows users are managing embarrassment risk — not model parameters — and have no mechanism to build confidence without waiting for production incidents.

### Customers / Users

**Primary — AOD decision-maker:** The person deciding whether to trust Brain enough to enable Autonomous Outage Detection. Usually the same person setting up the monitor. Two entry points:

| Persona | Situation | Goal |
|---------|-----------|------|
| **New service onboarding** | No Brain coverage today; gets IM by default | Zero to AOD quickly, easily, safely |
| **Existing service with low coverage** | Has some Brain monitors but stuck below 30% coverage or in Sev3 | Expand coverage without adding classic monitors or waiting for manual support |

Classic-monitor-satisfied existing services are not the target for this epic. They are not blocked from staying on classic monitors; they are simply not the primary design audience.

### Customer Problems and Insights

- **Validation happens entirely in production.** Services have no way to see what Brain would have done before enabling AOD. Getting to a first trustworthy outage takes 6+ weeks at P50 — entirely because confidence must be built through live production incidents.
- **Users manage embarrassment risk, not model parameters.** Research and qualitative data confirm that services are not tuning detection thresholds — they are managing the risk of paging the org incorrectly. The barrier to AOD is psychological, not technical.
- **Most services are stuck at low coverage.** Only 1 service has reached 100% detection coverage — via a union of classic Brain monitors and legacy Geneva monitors, not through IM. Most services are at ~30% or below. 671 classic monitors were in Sev3 observed-only mode as of fall 2025.
- **Expanding coverage requires more classic monitors.** IM today is OPM-only. Services that want DT, EB, or status-code detection must create separate classic monitors — accruing migration debt that will need to be resolved later.
- **Geneva monitors are outside the Brain ecosystem.** Noisy Geneva monitors require manual outage declaration. There is no first-class way to integrate them as signals or apply noise filtering through Brain.

---

## Goals & Features

### Goals

| No. | Goal | Priority |
|-----|------|----------|
| 1 | Services go from signal onboarding to AOD within a 3-day training window | P1 |
| 2 | AOD decision-makers can build confidence in Brain without waiting for production incidents | P1 |
| 3 | Services can expand detection coverage beyond OPM without adding classic monitors | P1 |
| 4 | Intelligent Monitors support custom scopes | P2 |
| 5 | Geneva monitors can be integrated as IM signals via noise filtering | P3 (Stretch) |

### Non-Goals

| No. | Non-Goal |
|-----|----------|
| 1 | **Not migrating existing classic monitors** — this epic ships the path to IM; driving existing services through it is a campaign, not a feature |
| 2 | **Not deprecating classic monitors** — deprecation is a future milestone contingent on coverage parity; no timeline set |
| 3 | **Not supporting latency SLIs in IM** — latency detection stays on classic monitors this window |
| 4 | **Not shipping Impact Assessment skill (low-config SIA)** — future workstream |
| 5 | **Not shipping critical customer list (S500 handling)** — out of scope for this epic |
| 6 | **Not building chat-based configuration** — V3+ exploration |
| 7 | **Not muting monitors during deployments/rollouts** — a future noise filtering extension |
| 8 | **Not driving Sev3 conversion** — capability ships; converting the 671 stuck monitors requires a campaign and is tracked as a lagging output metric |

### Features

| No. | Feature | Target Milestone | Priority |
|-----|---------|------------------|----------|
| 1 | Preview at IM setup — Brain backtests signals and shows projected outage behavior over the last 90 days | V1 (Q2 2026) | P1 |
| 2 | Risk tolerance parameter — AOD decision-maker sets how conservative Brain should be; conservative default recommended | V1 (Q2 2026) | P1 |
| 3 | What-if experience — adjust risk tolerance and see preview impact without retraining [OPEN: see Q1] | V1 (Q2 2026) | P1 |
| 4 | Conservative default activation — services go into AOD at Brain's most conservative setting; Brain only declares highest-confidence outages initially | V1 (Q2 2026) | P1 |
| 5 | QCS-only classic monitor carve-out policy — new non-QCS services blocked from creating classic monitors; QCS services may create classic monitors for urgent coverage needs | V1 (Q2 2026) — Policy | P1 |
| 6 | OPM custom scopes support [OPEN: see Q2] | V1 (Q2 2026) | P2 |
| 7 | DT/EB/status-code under IM abstraction — Brain auto-selects and balances detection models; users never choose the model | V2 (Q3 2026) | P1 |
| 8 | Model orchestration layer — Brain balances models dynamically, preserves existing tuning initially, converges toward unified intelligence | V2 (Q3 2026) | P2 |
| 9 | Custom scopes via model integration (fallback if OPM custom scopes doesn't land in V1) | V2 (Q3 2026) | P2 |
| 10 | Geneva noise filtering skill — integrate a Geneva monitor as an IM signal; Brain applies noise filtering and declares outages | Stretch (Q3 2026) | P3 |

**Note on Feature 10 (Geneva noise filtering):** This is the fastest path to moving the time-to-AOD metric for services with existing Geneva monitors — the user adds a monitor, gives Brain the filtering rules, and hits go. However, it advances coverage via a side path rather than through the core IM product architecture. Included as stretch with an explicit flag: leadership should decide whether this counts toward the target metric or is tracked separately.

---

## Definition of Success

### Success Metrics

**Input metrics** (what we control — tracked as feature delivery):

| No. | Metric | Target | By |
|-----|--------|--------|----|
| I-1 | Preview capability available to all new IM services | Shipped | Q2 2026 |
| I-2 | Risk tolerance parameter available to all new IM services | Shipped | Q2 2026 |
| I-3 | What-if experience available at tolerance adjustment | Shipped | Q2 2026 |
| I-4 | DT/EB/status-code under IM abstraction | Shipped | Q3 2026 |

**Output metrics** (what moves — tracked via telemetry and analytics):

| No. | Type | Outcome | Metric | Baseline | Target | By | Owner |
|-----|------|---------|--------|----------|--------|----|-------|
| O-1 | Cust | Faster time to AOD | Median time from signal onboarding to AOD for new IM services | 6+ weeks at P50 | ≤3 days | Sept 2026 | PM / Analytics |
| O-2 | Cust | IM adoption | Services reaching AOD via IM (not via classic monitors) | 0 post-March pilot | TBD — align to pilot cohort target | Sept 2026 | PM |
| O-3 | Tech | Coverage expansion | Detection coverage per service for IM-onboarded services | OPM-only ceiling (~30% for most) | Increases with DT/EB integration in V2 | Sept 2026 | Model Team |

**Considered but not primary** (for planning review discussion — may be promoted):

| Metric | Why not primary | Baseline |
|--------|----------------|----------|
| Classic monitors stuck in Sev3 | Moving this number requires a campaign, not just capability | 671 (fall 2025) |
| Manual outage declarations | Drops when Geneva skill absorbs noisy signals; stretch goal dependency | ~15% of Brain-detected outages |
| Severity/routing accuracy for critical customers | Requires S500/impact skill work that is explicitly out of scope | — |

> **Discussion Note:** P1 should be treated as "Must Have." P0 is reserved for rare, service-blocking scenarios. Input metrics and output metrics are tracked separately — shipping the capability is success for this epic; driving adoption is a follow-on campaign.

### Contributing Teams / Collaborators

| No. | Requirement or Deliverable | Producing Team |
|-----|----------------------------|----------------|
| 1 | OPM learning loop, DT/EB/status-code model integration under IM, model confidence outputs | AI Models |
| 2 | Backtesting infrastructure extension (not greenfield), model orchestration layer | AI Platform / AI Monitoring-Pipeline |
| 3 | Preview UI, risk tolerance UI, what-if experience | AI Experiences |
| 4 | Actions and policies wired to IM (IcM routing, severity, outage mode, autocomms) | AI Monitoring-Actions |
| 5 | Geneva monitor ingestion for noise filtering skill (stretch) | SLO/SLI Platform |

---

## Risks & Open Questions

*This section is non-standard for the Epic Spec template but is included to surface decisions that require leadership input before V1 scoping is locked.*

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Preview quality or speed is insufficient at 3-day training window | Medium | High | Backtesting infrastructure is an extension of existing work (not greenfield); DT/EB have proven 3-day training windows and serve as backup path if OPM preview quality is low at creation time |
| OPM custom scopes doesn't land in V1; some pilots don't adopt IM | Low | Medium | QCS carve-out keeps urgent cases unblocked on classic monitors; risk is low but warrants a go/no-go checkpoint before V1 GA |
| QCS carve-out overhead is higher than expected | Low | High | The delivery plan is contingent on QCS overhead for managing classic monitors remaining low enough to justify investing in IM with a limited coverage ceiling for non-QCS services. If this assumption breaks, the policy must be revisited and the phasing re-evaluated. |

### Open Questions

| ID | Question | Options | Owner | Target Resolution |
|----|----------|---------|-------|-------------------|
| Q1 | What-if implementation approach | (A) Confidence slider via precision recalculation — no retraining required; (B) Detection agent re-reasoning over existing anomaly set with a changed tolerance rule; (C) A+B with Brain-detected incidents during training window as additive label generation mechanism | PM + AI Models + AI Platform | Before V1 design kickoff |
| Q2 | Custom scopes preferred path | (A) OPM natively supports custom scopes — preferred; (B) Custom scopes arrive when DT/EB are integrated into IM in V2 — fallback, creates a period where custom scopes require classic monitors, which is a poor product story and increases tech debt | PM + AI Models | Before V1 design kickoff |
| Q3 | Risk tolerance naming | "Noise tolerance," "risk tolerance," or "Brain confidence level" — naming determines user mental model and how the parameter is explained in the UI | PM + UX | User research, before V1 UI design |

---

## Decision Log

| Decision | Options Considered | Rationale | Date | Owner |
|----------|--------------------|-----------|------|-------|
| Preview before tolerance setting | (A) Immediate AOD at click; (B) 3-day training window → review-and-adjust → AOD | Users cannot meaningfully set a risk tolerance without some preview context. "Click save → immediately in AOD" creates false confidence at an undefined tolerance. 3-day window gives Brain enough signal history to produce a meaningful backtested preview. | 2026-02-20 | PM |
| QCS-only classic monitor carve-out | (A) All services blocked from classic monitors immediately; (B) QCS carve-out; (C) No restriction | Option A is premature — IM's coverage ceiling is too low without model composition. Option C accrues migration debt for all new services. Option B stops debt accrual for the general user base while protecting business-critical services. Contingent on QCS overhead remaining manageable. | 2026-02-20 | PM |
| Geneva noise filtering as stretch | (A) Core scope; (B) Stretch with flag; (C) Out of scope | Geneva integration moves the coverage metric fastest but via a side path. Including it as core scope rewards the "shortcut" rather than the robust IM product architecture. Leadership should decide whether it counts toward the target metric. Included as stretch to allow delivery if capacity permits. | 2026-02-20 | PM |
| Latency SLIs excluded from IM | (A) Include latency; (B) Exclude, classic monitors required | Latency SLI support in IM requires model work that is not in scope this window. Exclusion is explicit to prevent scope creep during V1 design. | 2026-02-20 | PM |
