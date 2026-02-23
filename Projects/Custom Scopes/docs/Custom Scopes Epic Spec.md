# AIOps Epic

**Epic ID & Name:** `[FILL IN: ADO Epic ID]` — Custom Scopes  **Author:** Matthew Hetrick  **Status:** Draft  **Last Updated:** 2026-02-23

## Overview

### Elevator Pitch / Narrative

Custom Scopes launched at the end of 2025, giving services the ability to declare outages at any scope — scale unit, SI, custom dimension — instead of being locked to region. But the launch left structural gaps: services don't know what they're configuring, can only use one scope per SLI, are locked to the EB model, and can't get the same detection, health, or Intelligent Monitor experience they get at region. Brain's engineering team absorbs the toil of every custom scope setup manually. Custom Scopes today is a pilot; this epic makes it a fully supported, self-service product capability.

> If we close the structural gaps in custom scopes — documentation, multi-scope SLIs, full model coverage, and IM integration — then Brain-detected outage coverage will increase measurably for services using custom scopes, and time-to-enable will drop from days of manual coordination to self-service, because today services are either blocked, using workarounds, or waiting on the Brain team to configure custom scopes manually.

### Customers / Users

**Primary — Service Teams:** DRIs who need outage detection at non-regional scopes without unexpected behavior changes; Service Owners and SRE Leads who need coverage at granularities their services actually operate at (scale unit, SI, custom dimension); Config Admins who need to enable and manage custom scopes without filing requests in a Teams channel.

**Secondary — Internal (Brain):** Brain Product Team (needs custom scopes to work across all models and inside Intelligent Monitors); Brain Support (absorbs manual setup toil for every custom scope enablement today); Brain Platform Team (needs the detection agent and config schema to support multi-scope, multi-model scenarios).

### Customer Problems and Insights

- **Services don't understand what they're enabling.** There is no product documentation explaining the difference between single-dimension scopes (just region OR just SI), combined scopes (region + SI together), or what behavior change to expect. The ARM team hit this when discussing custom scope enablement — they expected detection at region level after enabling SI scope but would have gotten combined region + SI detection. Boris Y has noted multiple other services hit the same confusion. `[FILL IN: Boris Y specific examples]` `[FILL IN: Bryan examples]`

- **One scope per SLI with no independent outage criteria.** Services that need detection at two scopes must use different models as a workaround (EB for custom scope, DT for region). This breaks down when a service wants more than one non-location custom scope or wants different outage thresholds per scope. AFD is explicitly asking for multi-scope. Service Bus, OpenAI, and multiple identity services have also requested it. This maps to correlation and triage scenarios that drive TTM — not directly to coverage.

- **SI strings can't be parsed within the SLI signal.** MDM has multiple SLIs per stamp, BIC has multiple SLIs per individual scope within an SLI, and AFD uses a custom dimension for their "AFD region" (continent) instead of having it in the LID. This creates cardinality increases in the SLI signal and the number of signals streamed. It also means Brain doesn't understand the nesting of scope layers — impacting correlation and creating information overload for DRIs (Brain sends 3 outages to a service for each scope level, but those levels are hierarchically related; the DRI must figure that out themselves).

- **Custom scopes are EB-only.** Services cannot get latency SLI support at custom scopes (Azure OpenAI filed a dependency, though they still need to provide a concrete coverage projection). Services cannot view health in BCH at custom scopes. Brain Investigate shows incomplete data for custom-scoped services. The impact is satisfaction and product completeness — seeing detection in one place and not another erodes user trust.

- **Enabling custom scopes is still manual and painful.** For each SLI, the service team reaches out via Teams channel, and the Brain team updates configuration on the backend. `[FILL IN: confirm ~3 day time-to-enable, ~10h eng-hours per setup]`

- **AFD edge sites require a fragile manual workaround.** AFD emits two separate SLIs with manually specified nonstandard LIDs. Brain team and AFD team maintain custom configuration as AFD's edge footprint changes. Auto-comms at metro/edge granularity requires custom template work. The workaround doesn't generalize to other services with non-Azure authority locations.

## Goals & Features

### Goals

| No. | Goal | Priority |
|-----|------|----------|
| 1 | Services can configure custom scopes with predictable, documented behavior | P1 |
| 2 | Services can detect at multiple scopes from the same SLI with scope-specific outage criteria | P1 |
| 3 | Services can use information about different scopes in an outage to triage and mitigate more quickly | P2 |
| 4 | DRIs can understand if multiple outages at different scopes are related to each other | P2 |
| 5 | Services using custom scopes get the same detection, health, and IM experience as region-scoped services | P1 |
| 6 | Services with non-Azure locations get native Brain detection without manual workarounds | P2 |
| 7 | Services can represent a full health hierarchy from a single SLI | P3 |

### Non-Goals

| No. | Non-Goal |
|-----|----------|
| 1 | **Not building self-service custom scope UX on classic monitors:** We are choosing to put the scope selection UX into Intelligent Monitors, not classic monitors. Manual enablement via Teams channel continues as the interim process. |
| 2 | **Not supporting arbitrary customer-defined scope taxonomies:** Custom scopes use Brain's defined scope types (region, SI, custom dimension). Services cannot invent scope types Brain hasn't defined. |
| 3 | **Not building a classic → IM migration tool in this epic:** Migration of existing EB custom scope users from classic monitors to IM is a requirement, but it belongs to the IM epic, not this one. |
| 4 | **Not delivering health hierarchy visualization UX:** Pillar 6 (hierarchical SLIs) enables the data model. The actual BCH visualization experience for health hierarchies is a separate epic. |

### Features

**Phase 1 summary (H2 + near-term):** Services understand what custom scopes are and how to configure them. OPM supports custom scopes, unlocking IM scope selection UX for new users. Services can set multiple scopes per SLI with independent outage criteria. This phase focuses on the highest-urgency gaps: customer confusion, self-service enablement via IM, and multi-scope detection.

| No. | Feature | Target Phase | Priority |
|-----|---------|-------------|----------|
| 1 | Publish scope documentation: single / combined / hierarchical options, behavior, examples | Phase 1 | P1 |
| 2 | OPM supports custom scopes | Phase 1 | P1 |
| 3 | IM scope UX: if any signal contains additional scopes, user can select them | Phase 1 | P1 |
| 4 | Multiple scopes per SLI with independent outage criteria per scope | Phase 1 | P1 |
| 5 | Detection agent supports multi-scope evaluation (design extensible for IM) | Phase 1 | P1 |

> **Note:** Feature 4 (multi-scope per SLI) may depend on full model support in the detection agent. Engineering should confirm whether Phase 1 multi-scope can ship with EB-only or requires model work first. The design should be extensible from classic monitors to IM by updating the detection agent.

**Phase 2 summary (next semester):** Full model coverage at custom scopes removes the EB-only constraint. Health visualization extends to custom scopes in BCH and Brain Investigate. Pass-through enables services to detect at one scope and surface context from another.

| No. | Feature | Target Phase | Priority |
|-----|---------|-------------|----------|
| 6 | All detection models support custom scopes (DT, health-based, OPM) | Phase 2 | P1 |
| 7 | Health visualization at custom scopes in BCH | Phase 2 | P1 |
| 8 | Pass-through: detect at scope A, surface context from scope B in the incident | Phase 2 | P2 |
| 9 | Latency SLI detection at custom scopes (delivered via health-based model support) | Phase 2 | P2 |

**Phase 3 summary (future):** Hierarchical SLIs, edge site first-class support, and polish. These are real gaps but have workarounds today and affect fewer services immediately.

| No. | Feature | Target Phase | Priority |
|-----|---------|-------------|----------|
| 10 | Multi-scope hierarchical SLI support (single SLI, multiple hierarchical scopes) | Phase 3 | P2 |
| 11 | Edge Site LID schema: first-class non-Azure authority location support | Phase 3 | P2 |
| 12 | Correlation across scope levels within the same service | Phase 3 | P2 |
| 13 | Scope strength indicator in IM UX (signal coverage warning for low-coverage scopes) | Phase 3 | P3 |

### Phasing Rationale

**Why this order:**

- **Phase 1 prioritizes the urgent and unblocked:** Documentation is PM-driven (low eng cost). OPM custom scope support is the critical path for IM integration. Multi-scope per SLI is the highest-volume customer request (AFD, ARM, Service Bus, OpenAI, identity services) and has no workaround for services needing 2+ non-location scopes. These items are largely parallelizable across teams: docs (PM), OPM (AI Models + AI Platform), IM UX (AI Experiences), multi-scope (AI Monitoring-Pipeline).

- **Phase 2 fills the product completeness gaps:** Full model coverage is primarily about two things — ensuring we detect all outages we can for a service, and enabling health visualization as a core capability. The workaround (EB) exists today but is manual and incomplete. Pass-through has been requested repeatedly but services can work around it by choosing one scope. Latency SLI detection arrives naturally when health-based models support custom scopes — no special investment needed beyond the model work.

- **Phase 3 addresses real but less urgent structural limitations:** Hierarchical SLIs affect MDM, BIC, and similar services but they have workarounds (multiple SLIs). Edge sites affect primarily AFD, which has a functioning workaround. The scope strength indicator is a UX refinement that matters only after full model coverage ships and services are actively selecting scopes in IM — a timeline that won't arrive until Phase 2 is complete.

**Key sequencing dependency:** If Azure OpenAI does not provide a concrete coverage projection, latency SLI work will not be specifically prioritized — it will be delivered when the health-based model work in Phase 2 completes.

## Definition of Success

### Success Metrics

**Output Metrics (what moves)**

| No. | Type | Outcome | Metric | Baseline | Target | Priority |
|-----|------|---------|--------|----------|--------|----------|
| 1 | Cust | More outages detected for services with custom scopes | Outage coverage per service (for services with scopes enabled, % true outages detected) | `[FILL IN]` | `[FILL IN]` | P1 |
| 2 | Biz | Brain detects more outages overall | Overall Brain-detected outage coverage | `[FILL IN]` | `[FILL IN]` | P1 |

**Input Metrics (what we control — tracked, measurable)**

| No. | Type | Outcome | Metric | Baseline | Target | Priority |
|-----|------|---------|--------|----------|--------|----------|
| 3 | Cust | Faster enablement | Time-to-enable for custom scopes | ~3 days `[confirm]` | `[FILL IN]` | P1 |
| 4 | Tech | Lower setup toil | Engineering hours to set up custom scopes | ~10h `[confirm]` | `[FILL IN]` | P1 |
| 5 | Tech | Lower maintenance toil | Ongoing maintenance toil for custom scope configs (hrs/month) | `[need baseline]` | `[FILL IN]` | P1 |
| 6 | Tech | Reduced signal sprawl | Number of SLIs per service with different scopes | `[FILL IN]` | ↓ | P2 |
| 7 | Cust | DRI confidence in custom-scope incidents | DRI satisfaction with custom-scope incident experience | Not measured — need to instrument | `[FILL IN]` | P2 |

**Considered but Not Primary**

| Metric | Why not primary |
|--------|----------------|
| TTM for custom-scope outages | Correlation/triage helps TTM, but TTM is influenced by many factors outside this epic |
| AFD Brain coverage (31% today) | Depends on edge site work (Phase 3) — won't move near-term |
| % services using custom scopes | Useful but derivative — coverage metric captures the outcome better |
| Correlated vs. uncorrelated multi-scope outages | Requires instrumentation we don't have; consider promoting once hierarchical work ships |
| Number of services off manual workarounds | Derivative of multi-scope + model coverage metrics |

### Contributing Teams / Collaborators

| No. | Requirement or Deliverable | Producing Team |
|-----|----------------------------|----------------|
| 1 | OPM custom scope support | AI Models |
| 2 | IM scope selection UX; scope strength indicator (Phase 3) | AI Experiences |
| 3 | Detection agent multi-scope evaluation; pass-through pipeline | AI Monitoring-Actions |
| 4 | Multi-scope config schema; health engine custom scope support; LID schema for edge sites | AI Monitoring-Pipeline |
| 5 | OPM execution at custom scopes; pipeline infrastructure for multi-scope | AI Platform |
| 6 | Scope documentation | PM (Matthew Hetrick) |

### External Dependencies

| Dependency | Owner | Impact if Delayed |
|------------|-------|-------------------|
| Azure OpenAI coverage projection for latency SLIs | Azure OpenAI team | Latency SLI work not specifically prioritized; delivered via Phase 2 health-based model work |

## Risks & Open Questions

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OPM custom scope support slips → IM scope UX blocked, self-service stays manual | Medium | High | Continue manual enablement (accepted); escalate early if OPM timeline shifts |
| Classic → IM migration not planned by any team → existing custom scope users stranded on classic monitors | High | Medium | Flag as IM epic dependency; ensure migration is tracked even if not in this epic |
| Enablement volume re-surges as more services learn about custom scopes → manual process becomes untenable before IM is ready | Medium | High | Monitor support channel volume quarterly; define a trigger threshold for investing in interim UX |
| Multi-scope per SLI requires full model support → can't ship in Phase 1 with EB-only | Medium | Medium | Engineering to confirm; if true, re-sequence Phase 1 to include targeted model work |
| Edge site LID schema design takes longer than expected (no precedent for non-Azure locations) | Medium | Low | Phase 3 item — time buffer built in; can ship other pillars independently |
| Hierarchical SLI support requires SLI platform changes beyond Brain's control | Low | High | Early engagement with SLO/SLI Platform team; scope Phase 3 to avoid hard dependency if possible |

### Open Questions

| Question | Options Considered | Target Resolution |
|----------|--------------------|-------------------|
| Can multi-scope per SLI ship with EB-only, or does it require full model support? | (a) EB-only is sufficient for Phase 1, (b) Detection agent needs all models, (c) Ship with EB + OPM only | Eng review — `[FILL IN: date]` |
| What is the actual time-to-enable and eng-hours per custom scope setup today? | Estimates: ~3 days, ~10h — need confirmation from Brain support data | `[FILL IN: date]` |
| Which services have been confused by scope behavior? | ARM (confirmed in discussion), Boris Y examples `[FILL IN]`, Bryan examples `[FILL IN]` | `[FILL IN: date]` |
| Should DRI satisfaction be measured via survey or via proxy (e.g., incident re-triage rate)? | (a) Quarterly survey, (b) Instrument re-triage actions in IcM, (c) Both | `[FILL IN: date]` |
