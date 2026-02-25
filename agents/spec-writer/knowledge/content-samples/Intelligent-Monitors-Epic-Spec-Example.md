# Intelligent Monitors — Epic Spec Example

> **Purpose of this file:** A completed epic spec produced for the Intelligent Monitors Rb release. Use this as a concrete reference when producing epic specs — it follows the Epic-Spec-Template.md structure exactly and demonstrates the expected level of detail for the elevator pitch (customer journey + problem table + focus rationale + N×M scale argument + end state), feature-to-problem mapping, open questions format, and standard Appendix A/B/C structure.

---
# AIOps Epic — Intelligent Monitors

**[Epic 36776351 Intelligent Monitors - GA]**

Author:
Status: Draft
Last Updated:

---

## Overview

### Elevator Pitch / Narrative

Every Microsoft service team follows a sequential journey to get detection value from Brain:

**Create Signals → Integrate with Brain → Get First Value (enable outage mode) → Achieve sufficient value (high Brain coverage)**

The north star experience is that a customer can automatically create a holistic set of signals, automatically integrate them into Brain, and immediately get Brain detecting all their outages.

The fundamental problem with today's experience—relative to that north star—is the time and effort (from both the service team and Brain) it takes to enable AOD and then iterate to reach high coverage (~>70%):

| Integration path | TTV-AOD | Eng Toil | TTV & toil to hit high coverage* |
|---|---|---|---|
| Author SLIs → integrate → enable AOD | 7 weeks (1 week integration, 6 weeks "tuning") | 110 hrs / 5 mo / 20 svcs | 7 weeks × N SLIs |
| Integrate Geneva monitors | 1 week | ~0 hours | 1 week × M monitors |

*\*Not many services today have high coverage, so these are estimates. N will typically be << M.*

As we plan for Rb, we focus on **Pillar 3 — Get First Value (enable outage mode)** because:

- **Pillar 1 (Create Signals)** is an orthogonal problem. Our partners—the SLI team and SRE—are investing in making signal creation easier. Brain can help here eventually, but it is not the immediate priority given the addressable problem areas downstream.
- **Pillar 2 (Integrate with Brain)** saw significant improvement in Kr with one-click onboarding: now 1 person, 5 minutes, automation runs for 3 days. The time × toil surface area is substantially reduced.
- **Pillar 4 (Achieve sufficient coverage)** is the right long-term goal, but we must remove the "get your first outage" bottleneck before we can improve "getting more outages." We want to design the solution with an eye toward minimizing the work needed to achieve high coverage—but the goal of Rb is not to move the coverage needle itself. We want the system to make it so we don't have to do all this work iteratively for every service going forward. Additionally, we have a dedicated workstream (SHIM) doing this for the most critical services today.

When we asked services what would allow them to build confidence more quickly, they replied overwhelmingly: they need to see a preview of what Brain would do—especially if they were to change one of Brain's settings ([Customer Feedback Survey: Brain Monitor Tuning Experience](link)).

There are 3 main constraints with building this preview (sections flushed out in the appendix):

- **It cannot be per signal or per model.** Making per-signal/per-model tuning easier reduces friction within the wrong paradigm. A service with 20 SLIs still has 20 previews to review. FPSS is planning thousands of signals. The N×M world is mathematically incompatible with scale. *(See Appendix A: Why Not Improve Classic Monitors?)*
- **Geneva monitor integration is not the shortcut it appears to be.** It advances a coverage metric via a side path rather than through the SLI paved path, and noisy Geneva monitor noise-filtering is architecturally unproven as a core bet. *(See Appendix A: Why Not Geneva Monitors First?)*
- **We cannot wait for DT/EB to be under IM before shipping this.** OPM is already the right model for Phase 1—it is the only model that natively looks across multiple signals. The OPM coverage ceiling is a known, mitigated limitation, not a reason to delay the paradigm shift. *(See Appendix A: Why Not Wait for DT/EB?)*

But here is the constraint that shapes how we deliver that: it must work across **all signals at once**, not per signal, not per model.If we build the preview and risk tolerance experience within today's per-signal/per-model paradigm, we've only made an intractable problem slightly more comfortable. A service with 20 SLIs still has 20 things to preview and tune. FPSS is planning thousands of signals. Even if we reduced the cost of per-signal/per-model configuration to near zero, the combinatorial burden would still be prohibitive at scale.

**This is why Rb cannot end in a world where we've made classic monitors easier to tune. It must end in a world where the user configures one thing.**

> *Rb's job is not to make it easier to tune classic monitors—it's to make the concept of "build confidence through tuning per signal and per model" obsolete. One knob, historical preview, all signals. In days.*

We will break the N×M tuning cycle by collapsing per-signal/per-model configuration into a single service-level aggressiveness dial, backed by a historical preview that lets services build confidence before going live—so the next service doesn't need an army of people to help them.

**End of Rb state:** Services setting up Brain can easily create an Intelligent Monitor and turn on AOD within 1 week. They can build confidence in Brain by previewing Brain's historical behavior, and start using Brain immediately at the risk tolerance that aligns with their goals. To improve Brain's performance over time, they do not need to add per-signal/per-model "classic" Brain monitors.

---

## Rb Starting State (ideal)

By the end of March, Intelligent Monitors will be a customer-visible concept for a controlled set of pilot services:

- Pilots have a new customer-visible Intelligent Monitor
  - Sits above existing classic monitors
  - Uses OPM as the first underlying model
  - Doesn't delete or hide existing DT/EB/status-code monitors
- Pilots get a basic Intelligent Monitor UI
  - Configure detection behavior and actions (IcM routing, severity, outage mode, auto-comms)
  - Review detections and label them to feed OPM learning loops
- Current behavior is preserved — classic monitors stay visible and operate as they do today. Intelligent Monitors are additive.
- Post-March onboarding stays flexible — new services can choose Intelligent Monitors or classic monitors. Intelligent Monitors are recommended, not yet mandatory.

**Bottom line:** March makes Intelligent Monitors real. Next, we make them trustworthy by default by shifting validation left, expanding model coverage, and enabling safe extensibility.

---

## Customers / Users

**Primary Customer:** The service AOD decision-maker — the person deciding whether to trust Brain enough to enable Auto-Outage Detection. Usually the same person setting up the monitor.

There are 2 meta-personas this person can belong to:

| Persona | Situation | Goal |
|---|---|---|
| New service onboarding | No Brain coverage today; set up Brain for the first time by creating an IM | Quickly, easily, safely, and confidently get Brain monitoring their service and declaring outages (AOD) |
| Existing service with low coverage | Has some Brain monitors but stuck with low/no coverage | Expand coverage without a ton of toil (like adding/tuning classic monitors or waiting for manual support) |

*Non-target: Existing service with high coverage — has Brain monitors performing well with manual support. Flip over to IM later.*

---

## Customer Problems and Insights

**Users "tune" noise risk & effective detection, not model parameters**

Research and qualitative data confirm that services tune thresholds to balance the risk of paging their DRIs incorrectly whilst confirming that Brain will detect the things they want. This takes a long time because striking this balance is a seesaw game to pick the right numbers.

**Long cycles of validation in production**

Services must play the seesaw game in production and wait for live data to make their next move. They have no way to see what Brain would have done before enabling AOD. Getting to a first trustworthy outage takes 6+ weeks at P50—entirely because confidence and tuning must be built through live production incidents. SRE has some optimizations here for EB specifically, but that is not a product solution.

**Most services are stuck at low coverage without manual help**

Only 1 service has reached 100% Brain coverage even with manual help (SQL in Jan 2026). This was also via a union of classic SLI+Brain monitors and legacy Geneva monitors. Most services (even those with manual help) are at ~30% Brain-detected coverage or below, and 671 classic monitors were in Sev3 observed-only mode as of fall 2025.

**Expanding coverage requires more classic monitors**

IM today is OPM-only. Services that want DT, EB, or status-code detection must create separate classic monitors—accruing migration debt that will need to be resolved later.

**Geneva monitors are conceptually outside Brain monitoring**

There is no first-class way to integrate Geneva monitors as signals. Over the last 6 months, ~30% median Brain-detected coverage vs ~38% Geneva monitor coverage for a total of ~68-70%. 15% of all outages across Azure QCS are also manually declared through Geneva monitors due to noisy detection.

---

## Goals & Features

### Goals

| No. | Goal | Priority |
|---|---|---|
| 1 | Services go from signal onboarding to AOD (at a service level) within a N-day training window | P0 |
| 2 | AOD decision-makers can build confidence in Brain without waiting for production incidents | P0 |
| 3 | Services can expand detection coverage without adding classic monitors | P0 |
| 4 | Intelligent Monitors can detect issues at any scope | P1 |
| 5 | Geneva monitors can be used by Intelligent Monitors to declare outages | P2 (Stretch) |

### Non-Goals

| No. | Non-Goal |
|---|---|
| 1 | Migrate existing classic monitors — this epic ships the path to IM; driving existing services through it is a campaign, not a feature |
| 2 | Latency SLIs in IM — latency detection stays on classic monitors this window |
| 3 | Custom Impact Assessment skill (low-config SIA) — future workstream |
| 4 | Brain monitors critical customer list (S500 handling) — out of scope for this epic |
| 5 | Chat-based configuration — V3+ exploration |
| 6 | Mute monitors during deployments/rollouts — a future noise filtering extension |

### Features

**Uber Policy:** New non-QCS services blocked from creating classic evaluator monitors to avoid tech debt & future migration cost; QCS services may create classic monitors for urgent coverage needs.

**Rb H1 Summary:** Intelligent monitors become a fast, confidence-first path to AOD — preview before you trust it, plus simple controls to choose how conservative Brain should be, even if the coverage ceiling is limited since IMs can still only use OPM.

Key capabilities:
- 90-day backtest preview during setup
- Risk tolerance control + "what-if" preview when adjusting
- Conservative-by-default AOD activation (highest-confidence outages first)
- Stretch: Custom scopes supported by IM

The ideal end state for a service setting up an intelligent monitor in Rb H1:

1. Service onboards to Brain with N SLIs
2. Service clicks "create intelligent monitor"
3. Service enters their ICM team, adjusts default SLIs, names the monitor, and clicks save
4. Brain trains OPM on last 90d of SLI data
5. Brain notifies service that training is complete
6. Service reviews what Brain would have done over the interval (changing labels as needed), sets their risk tolerance, and turns on AOD
7. Brain retrains OPM when a new signal is added, or when new FP/FN/TP data arrives

| No. | Feature | Target Milestone | Priority |
|---|---|---|---|
| 1 | Create intelligent monitor UI | Rb H1 | P0 |
| 2 | Preview at IM setup — Brain backtests signals and shows projected outage behavior over the last 90 days (OPM-only) [OPEN — See Q1] | Rb H1 | P0 |
| 3 | Risk tolerance parameter — AOD decision-maker sets how conservative Brain should be; Brain provides a default recommendation or most conservative setting [OPEN — See Q1] | Rb H1 | P0 |
| 4 | What-if experience — adjust risk tolerance and see preview impact without retraining [OPEN: see Q2] | Rb H1 | P0 |
| 5 | OPM custom scopes support [OPEN: see Q3] | Rb H2 | P1 |

### Open Questions (Rb H1)

| ID | Question | Options | Owner | Target Resolution |
|---|---|---|---|---|
| Q1 | What is risk tolerance | (A) Linked to OPM confidence level (B) Throttling setting to control volume (C) Impact-based setting (only declare outages with impacted subs in 90th percentile) | AI Models / AI Monitoring pipeline | Before V1 design kickoff |
| Q2 | What is the UX for what-if and how will it be powered | (A) Confidence slider via precision recalculation — no retraining (B) Detection agent re-reasoning over existing anomaly set with changed tolerance rule (C) A+B with Brain-detected incidents during training window as additive label generation | PM + AI Models + AI Platform | Before V1 design kickoff |
| Q3 | Custom scopes preferred path | (A) OPM natively supports custom scopes — preferred (B) Custom scopes arrive when DT/EB are integrated in V2 — fallback, increases tech debt | PM + AI Models | Before V1 design kickoff |

---

**Rb H2 Summary:** One service-level monitor that expands coverage without multiplying monitors — Brain chooses/combines models for you, tunes using historical data, and custom scopes are supported even if OPM custom scopes didn't land.

Key capabilities:
- DT/EB/status-code coverage under the IM abstraction (no "pick the model" experience)
- Brain balances models dynamically to achieve optimal coverage & speed (TTO) within the user-defined risk tolerance
- Fallback path for custom scopes via models if OPM cannot support
- Stretch: Shortcut to bring existing Geneva monitors into IM — Brain filters noise and declares outages from those signals

The ideal end state for a service setting up an intelligent monitor in Rb H2:

1. Service onboards to Brain with N SLIs
2. Service clicks "create intelligent monitor"
3. Brain trains all production models (DT/EB/OPM at least) on last 90d of SLI data
4. Brain notifies service that training is complete
5. Service reviews the data, sets their risk tolerance, and turns on AOD
6. Brain retrains/runs auto-tuning when new signals are added or new FP/FN/TP data arrives

| No. | Feature | Target Milestone | Priority |
|---|---|---|---|
| 6 | Custom scopes via model integration (fallback if OPM custom scopes doesn't land in V1) | Rb H2 | P0 |
| 7 | DT/EB/status-code under IM abstraction — Brain backtrains detection models and auto-selects or auto-weights [OPEN: See Q4] | Rb H2 | P0 |
| 8 | DT/EB/status-code under IM abstraction — Brain auto-tunes the service monitor to optimize coverage within the service's noise tolerance | Rb H2 | P1 |
| 9 | Geneva noise filtering skill — integrate a Geneva monitor as an IM signal; Brain applies noise filtering and declares outages** | Stretch (Q3 2026) | P2 |

### Open Questions (Rb H2)

| ID | Question | Options | Owner | Target Resolution |
|---|---|---|---|---|
| Q4 | How will Brain "pick" the best model per signal | (A) Brain runs DT/EB in parallel at onboarding and picks the model with better performance (B) Brain builds a hybrid model that weights models based on signal attributes | AI Platform | Before Q2 |

*\*\*Note on Feature 9 (Geneva noise filtering): This is the fastest path to moving time-to-AOD for services with existing Geneva monitors. However, it advances coverage via a side path rather than through the core IM product architecture. Included as stretch with an explicit flag: leadership should decide whether this counts toward the target metric or is tracked separately.*

---

## Definition of Success

### Success Metrics

| No. | Type | Outcome | Metric | Baseline | Target |
|---|---|---|---|---|---|
| 1 | Cust | Faster time to AOD | Median time from signal onboarding to AOD for new IM services | 6+ weeks at P50 | ≤3 days |
| 2 | Cust | IM adoption | Services reaching AOD via IM (not via classic monitors) | March pilot ~5 | TBD |
| 3 | Tech | Coverage expansion | Detection coverage per service for IM-enabled services | OPM-only ceiling | Increases with DT/EB integration |

Considered but not primary:

| No. | Type | Outcome | Metric | Baseline |
|---|---|---|---|---|
| 1 | Cust | Classic monitors stuck in Sev3 | Moving this number requires a campaign, not just capability | 671 (fall 2025) |
| 2 | Cust | Manual outage declarations | Drops when Geneva skill absorbs noisy signals; stretch goal dependency | ~15% of Brain-detected outages |
| 3 | Tech | Severity/routing accuracy for critical customers | Requires S500/impact skill work that is explicitly out of scope | — |

---

## Contributing Teams / Collaborators

| No. | Requirement or Deliverable | Producing Team |
|---|---|---|
| 1 | OPM learning loop, DT/EB/status-code model integration under IM, model confidence outputs | AI Models |
| 2 | Backtesting infrastructure extension (not greenfield), model orchestration layer | AI Platform / AI Monitoring-Pipeline |
| 3 | Preview UI, risk tolerance UI, what-if experience | AI Experiences |
| 4 | Actions and policies wired to IM (IcM routing, severity, outage mode, autocomms) | AI Monitoring-Actions |
| 5 | Geneva monitor ingestion for noise filtering skill (stretch) | SLO/SLI Platform |

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Preview quality or speed is insufficient at 3-day training window | Medium | High | Backtesting infrastructure is an extension of existing work (not greenfield); DT/EB have proven 3-day training windows and serve as backup path if OPM preview quality is low at creation time |
| OPM custom scopes doesn't land in V1; some pilots don't adopt IM | Low | Medium | QCS carve-out keeps urgent cases unblocked on classic monitors; warrants a go/no-go checkpoint before V1 GA |
| QCS carve-out overhead is higher than expected | Low | High | Delivery plan is contingent on QCS overhead for managing classic monitors remaining low enough to justify investing in IM with a limited coverage ceiling. If this assumption breaks, the policy must be revisited and phasing re-evaluated. |

---

## Appendix

### Decision Log

| Decision | Options Considered | Rationale | Date | Owner |
|---|---|---|---|---|
| Preview before tolerance setting | (A) Immediate AOD at click; (B) 3-day training window → review-and-adjust → AOD | Users cannot meaningfully set a risk tolerance without preview context. "Click save → immediately in AOD" creates false confidence. 3-day window gives Brain enough signal history to produce a meaningful backtested preview. | 2026-02-20 | PM |
| QCS-only classic monitor carve-out | (A) All services blocked immediately; (B) QCS carve-out; (C) No restriction | Option A is premature — IM coverage ceiling is too low without model composition. Option C accrues migration debt for all new services. Option B stops debt accrual for the general user base while protecting business-critical services. | 2026-02-20 | PM |
| Geneva noise filtering as stretch | (A) Core scope; (B) Stretch with flag; (C) Out of scope | Geneva integration moves the coverage metric fastest but via a side path. Including it as core scope rewards the shortcut rather than the robust IM product architecture. Leadership should decide whether it counts toward the target metric. | 2026-02-20 | PM |
| Latency SLIs excluded from IM | (A) Include latency; (B) Exclude, classic monitors required | Latency SLI support in IM requires model work not in scope this window. Exclusion is explicit to prevent scope creep during V1 design. | 2026-02-20 | PM |

---

## Appendix A: Why Not X?

These are the questions that consistently come up in planning conversations. Capturing the answers here prevents relitigating them during execution.

### Why not just make per-signal/per-model tuning easier instead?

Because it solves friction within the wrong paradigm. Even if we reduced the cost of configuring each signal/model combination to zero, a service with 20 SLIs still has 20 things to tune. FPSS is planning thousands of signals. The per-signal/per-model world is mathematically incompatible with scale—and we already have an army of SRE and Brain team members papering over this problem for today's services. The goal is not to make it easier for the next service to need the army. The goal is to make it so they don't need the army at all. That requires collapsing N×M configuration into one service-level parameter, not optimizing each of the N×M steps.

### Why not invest in Geneva monitor integration as the first step?

Geneva monitors are a **program** win (they move the coverage metric quickly) but a **product** loss (they don't advance the paved path the organization has bet on).

Specifically:
- Noise-filtering for noisy Geneva monitors is architecturally unproven at this time—committing to it as a core feature bet carries meaningful delivery risk
- Geneva monitors require a new monitor per failure pattern; outage patterns constantly evolve, and SLIs are inherently more customer-centric and adaptive
- New services (AOAI, BIC, Nuance, AzureML) have found SLI+Brain more effective from the start than whac-a-mole Geneva monitor authoring
- Investing in Geneva integration in Rb means optimizing coverage metrics via a side path rather than building the SLI-based product that scales

Geneva monitor integration is included as a **stretch goal** in Rb H2 precisely so leadership can decide whether it counts toward the target metric or is tracked separately. But it should not drive prioritization decisions for the core IM experience.

### Why not wait until DT/EB are integrated under IM before shipping?

OPM is already the right model to build Phase 1 around because it is the only model that natively looks across multiple signals—which is a prerequisite for the service-level, cross-signal paradigm shift we are trying to make. DT and EB still require per-signal parameters to get to high coverage; hiding them under IM today would be hiding knobs users still need.

Waiting for DT/EB integration (Rb H2) before introducing the paradigm shift (preview + risk tolerance + cross-signal) would delay the foundational bet by an entire half-semester. The OPM ceiling is a known limitation of Rb H1—it is explicitly flagged, mitigated by the QCS carve-out policy, and resolved in H2.

### Why not improve coverage for existing services instead of focusing on new service onboarding?

We have a dedicated workstream (SHIM) already doing this for the most critical services. The bottleneck is not the lack of people doing the coverage work—it is that the *product path* to first outage is broken for new services. If we don't fix the product path now, every new service joining Brain still needs the army. Fixing it scales the product; adding more army does not.

---

## Appendix B: Customer Research Summary

The design choices in this epic are grounded in direct customer feedback, not assumptions. Key findings:

**Source: Customer Feedback Survey — Brain Monitor Tuning Experience** *(link)*

When asked what would allow them to build confidence in Brain more quickly, services replied overwhelmingly with two needs:

1. **A preview** — the ability to see what Brain would have done historically before enabling outage mode
2. **A single aggressiveness/confidence control** — rather than needing to understand and tune individual model parameters, services want a high-level dial that expresses *how conservative Brain should be*, with Brain owning the rest

No service asked for per-signal or per-model tuning to be faster. The ask was to remove the need for per-signal/per-model reasoning entirely.

**Supporting qualitative signals:**
- Services describe tuning today as "a seesaw game"—not understanding model parameters, but trying to find a balance between embarrassment risk (paging the org incorrectly) and confidence that Brain will actually fire when they need it
- The 6+ week P50 timeline to first outage is driven almost entirely by this production-based validation cycle, not by the technical complexity of setup
- Early OPM results and pilot results show customers respond positively to Brain looking at patterns across *all* their signals rather than requiring per-signal configuration

**Implication for design:** The preview and risk tolerance are not nice-to-haves—they are the specific things customers said would let them turn on AOD immediately. The design constraint is to deliver these at the service level (across all signals at once) so the preview and confidence dial don't themselves become N×M work.

---

## Appendix C: Glossary

| Term | Definition |
|---|---|
| **Intelligent Monitor (IM)** | A service-level Brain monitor that abstracts away per-signal, per-model configuration. Users configure one monitor per service (or a small number for complex topologies) rather than one monitor per SLI × model combination. |
| **Classic Monitor** | The current Brain monitor paradigm: one monitor per SLI, configured for a specific detection model (DT, EB, OPM, status-code). Requires per-signal parameter tuning and manual promotion to outage mode. |
| **Risk Tolerance / Aggressiveness Dial** | The single service-level parameter in Intelligent Monitors. Controls how conservative Brain is across all signals at once—a high setting means Brain only fires on highest-confidence outages; a lower setting means Brain fires earlier with more risk of noise. The conceptual replacement for per-signal threshold tuning. |
| **Preview / Backtest** | A historical simulation showing what Brain would have declared as outages over a past time window (e.g., last 90 days) given the service's current signals and risk tolerance setting. Allows services to build confidence before enabling AOD. |
| **What-if** | The ability to adjust the risk tolerance dial and immediately see how the preview changes—without retraining. Closes the preview → configuration → re-preview loop that today happens in production. |
| **AOD (Auto-Outage Detection)** | The Brain mode where Brain automatically declares outages and initiates comms, without requiring a human to manually promote a detection to outage status. Enabling AOD is the primary goal of onboarding. |
| **OPM (Outage Prediction Model)** | Brain's multi-signal detection model. The only current Brain model that natively reasons across multiple SLIs simultaneously, making it the right foundation for Phase 1 Intelligent Monitors. |
| **N×M problem** | The combinatorial scaling problem in today's classic monitor paradigm: a service with N SLIs and M detection models must configure and tune up to N×M monitors. For services with large or growing signal portfolios (e.g., FPSS), this is intractable. |
| **TTV-AOD** | Time-to-Value for AOD: the elapsed time from a service's signal onboarding to having Auto-Outage Detection enabled. Current P50 is 6+ weeks via the SLI path. Rb target: ≤1 week. |
| **SHIM** | The Brain for Service Health Initiative Management workstream. A dedicated program investment focused on improving coverage for the highest-priority QCS services via hands-on support. Distinct from the product investment in Intelligent Monitors, which targets *self-service* onboarding. |
| **QCS (Quality Critical Services)** | The set of Azure services designated as highest-priority for Brain coverage. QCS services have a carve-out in Rb to continue creating classic monitors for urgent coverage needs while the IM coverage ceiling is still OPM-only. |


