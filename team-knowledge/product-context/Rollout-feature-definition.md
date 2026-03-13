# Brain Rollout Lifecycle Definitions (Draft for Team Alignment)

*Owner: TBD (Proposed: AIOps PM Group)*
*Last updated: January 30, 2026*

## Problem Statement

Teams across Brain and AIOps lack a shared, consistently applied definition of rollout stages (Pilot, Private Preview, Public Preview, GA). This ambiguity has led to:
Confusion about quality, support, and documentation expectations.
Difficulty determining whether a feature is ready for external usage, customer onboarding, or sovereign cloud rollout.
Blurred lines between *capability readiness* and *customer adoption*.
Overuse of terms like “limited preview,” “pilot,” “early customers,” creating inconsistent communication.
Premature release attempts without meeting readiness checks (e.g., compliance, documentation, UX, operationalization).
This misalignment slows down feature adoption, complicates communication, and introduces risk when exposing new capabilities.
This document will focus on **detection** feature work. We can look to extend it to other feature types in the future, but where the most churn has been felt is defining the rollout for detection features across the whole stack.
Concrete recent examples:
Rolling out custom scopes
Rolling out OPM
Rolling out status code support
Introducing Intelligent monitors
Ambiguity around EB/DT/TV/Latency all at different stages in the product- what to tell users?
Some of this is being addressed in . The goals of that are to identify deltas and determine how we internally track, communicate to customers, and introduce new models. This document builds on that work to define a feature-level lifecycle and rollout stages.

## Why Clear Lifecycle Definitions Help Us

Clear definitions allow us to to **plan, track, execute, and review** feature development in a consistent manner month over month
**Predictability & Accountability: **Clear definitions ensure all teams understand what “ready” means, reducing subjective interpretation and aligning engineers, PMs, and design.
**Improved Cross****‑****Team Alignment: **AIOps features span Detection Agent, Impact Agent, ML Platform, UCP, UX, and partner services. Shared terminology reduces miscommunication across org boundaries.
**Better Planning & Capacity Allocation****: **Knowing which stage a feature is in enables better forecasting, resource planning, and customer onboarding sequencing.
**Customer Trust & Experience****: **Consistent expectations around stability, support, docs, and UX ensure features don’t reach customers before they are truly ready.
**Alignment With Engineering Realities****: **Internal validation modes (shadow, escrow) can co-exist with rollout stages when each has a clear role.

## Proposed Two-Axis Readiness Model

This section explains how we evaluate a feature’s readiness along two dimensions: (1) its engineering maturity — whether it is safe, resilient, and operable at scale; and (2) its capability maturity — what end‑to‑end customer experience the feature supports. By separating these, we avoid conflating platform stability with product completeness, and we create clearer, more objective rollout guidance.
### Axis A — Engineering Readiness Levels (ERLs)

The main driving question for determining each level is: **how many customers can be reasonably supported****?** We propose to define this by operational toil (how much effort to make it work for users), and by system robustness (our engineering fundamentals- how brittle is this at scale).
**Operational Toil** (setup & ongoing management)
1) Setup effort — manual vs. automated deployment/config flows (Portal/GitOps)
2) Support burden — engineer intervention frequency; runbooks; standard workflows
3) Runtime environment — siloed prototype vs. integrated Brain agents/pipelines
4) Documentation — internal ops docs; external customer docs
5) Feedback loop — backtesting/tuning/validation: manual → automated

**Engineering Fundamentals** (technical soundness & reliability)
6) Telemetry & analytics — depth, diagnosability, authoritative dashboards
7) Sovereign cloud — data locality/dependency footprint readiness
8) Resiliency model — regional redundancy, failover, graceful degradation
9) Security & compliance — SDL/SFI/QEI, threat model, audits
10) Scalability & performance — capacity, perf, cost envelope at Azure scale

**ERL1 — Prototype / Unsafe to Scale** *(no customers)*
**Toil:** setup & config are manual and brittle; ad‑hoc support; runs in side pipelines; tribal‑knowledge docs; **manual** backtesting only
**Fundamentals:** minimal telemetry; no sovereign; no resiliency; no formal security; no scale validation
**ERL2 — Manually Operable at Scale** *(****can support a small set of ******customers****** or a large number of customers with low service reliability****)*
**Toil:** setup remains **manual but documented**; support is feasible but requires engineers; feature is integrated into **standard Brain agents/pipelines**; basic internal docs; **manual** backtesting/tuning/validation
**Fundamentals:** basic telemetry; best‑effort resiliency; baseline rollback patterns; small‑scale capacity OK
**ERL3 — Automatically Operable at Scale** *(****can support large number of customers with sufficient reliability****)*
**Toil:** **automated** enablement (Portal + GitOps); **automated** backtesting/tuning/validation gates; platform‑enforced guardrails; automated deploy/rollback; TSGs & support SLA defined
**Fundamentals:** complete telemetry for diagnosis; regional resiliency baseline; performance validated for preview scale; customer‑facing docs
**ERL4 — Production / GA‑Grade** *(all Azure/all MSFT able to be supported with published SLAs)*
**Toil:** seamless multi‑cloud automation; mature ops with SLO/SLA governance; zero‑touch standard flows
**Fundamentals:** full SDL/SFI/QEI; failover & recovery; Azure‑wide capacity/perf; sovereign‑cloud ready; authoritative analytics

#### ERL matrix (levels × sub‑dimensions)


### Axis B — Capability Readiness Levels (CRLs) (Customer experience only)

Capability readiness is all about enabling customer adoption & value. This can be thought of in 4 stages based on what is most important to increase adoption & reduce the customer time-to-value of a detection feature. Value in this case means the service can use the feature to improve how they use Brain to monitor their service for issues. 
**CRL1 — Core Value Ready****/****Enable the functionality**
What’s required for a **handful of customers** to realize value:
Detection logic, **outage declaration**, incident creation
**Impact assessment**
Basic **IcM enrichment**
GitOps based manual configuration by Brain on behalf of customers
**CRL2 — Reduce friction**
**DRIs can easily understand** the issues using Brain Investigate
**Easily enable & manage the feature **using UI setup & configuration in the Brain experience
**Minimize DRI overload** by correlating incidents/outages
**Auto‑Comms** supported
**CRL3 — Expand Satisfaction**
**Deployment health checks** supported if relevant
**Recovery dashboard** supports the scenario
**Support agent** integration for AskBrain support
**BCH **views are available for the feature when applicable
**Auto-Triage** supports the scenario
**Auto-Diagnosis** for triage/RCA
**CRL4 -- E2E Completeness**
**Brain analytics**** **shows customers the relevant metrics to see if the feature is working for them
**Extensibility **hooks for custom instructions to Brain

## How Rollout Stages Map to the Simplified Model

Each public rollout label is now defined as a **combination** of ERL (engineering maturity) and CRL (capability maturity). This updated table reflects the addition of **ERL2 (Manually Operable at Scale)** and **ERL3 (Automatically Operable at Scale)**.
## 10. Why this simplifies decisions

Why this simplifies decisions
**No double counting** of “toil”: all automation/validation/ops maturity lives in **ERL**.
**CRLs read like product surfaces** customers care about; easier for PM/design/CSMs to reason about.
Stage gates are **objective**: ERL gates reviewed by platform/security; CRL gates reviewed by PM/UX/CS.

## 11. Adoption Checklist

Use this for Shiproom reviews, feature specs, program increments, and rollout decisions.
#### Engineering Readiness (ERLs 1–4)


### Customer Experience Readiness (CRLs 1–4)


### How to Use This Checklist

A feature must **meet all ERL exit criteria** to move to the next engineering stage.
A feature must **meet all CRL exit criteria** to move to the next capability stage.
Rollout stages (POC → Pilot → Private Preview → Public Preview → GA) now tie directly to **ERL + CRL combinations** listed in Section 9.
Shiproom uses this checklist as the *single source of truth* for readiness.

# Appendix

Earlier draft
## Phase 0 — Experimental / Incubation (Internal Only)

**Purpose:** Validate feasibility and core technical hypotheses- does the idea work?
**Intended consumers:** Brain engineering teams only.
**Supported Brain capabilities in this phase:**
**Offline evaluation & backtesting** of new detection models and signals (no customer visibility).
**Prototype health calculation** experiments (internal-only, non-production).
**No external surfaces** exposed; no BCH/Investigate/IcM/Auto‑Comms.
**Criteria:**
Prototype implementation exists (not production‑grade).
No customer exposure (aside from maybe a few conversations to get the idea to work)
No compliance, documentation, or UX requirements.
Manual or notebook‑based validation.

## Phase 1 — Pilot (Internal + Design Partners)

**Purpose:** Validate whether the *capability* solves the intended problem for a constrained internal or design‑partner audience.
**Intended consumers:**
Internal AIOps teams.
Hand‑selected partner services (3-5)
**Supported Brain capabilities in this phase:**
**Detection Agent (limited scope)**: health evaluation + initial detection logic for targeted signals.
**Incident Creation (internal/test queues)**: create incidents for evaluation without broad customer paging.
**Impact Assessment (if applicable)**: early impact computation for the targeted scenarios.
**Telemetry capture for model performance** (basic dashboards acceptable).
**No external BCH/Investigate/IcM/Auto‑Comms** yet (kept internal or disabled).
**Criteria:**
Core model or detection logic works for targeted scenarios.
Manual operations allowed.
Basic telemetry available.
No guaranteed SLA or support.
No sovereign cloud requirements.

## Phase 2 — Private Preview

**Purpose:** Validate real‑world usage with a small set of external customers under controlled conditions.
**Intended consumers:**
Selected external customers (1P services) (20-50 services)
**Supported Brain capabilities in this phase:**
**Stable detection pipeline** (shadow/escrow/A‑B/backtesting mechanisms active for safety).
**Configuration experiences**: Jarvis **Portal configuration** + **GitOps/Config‑as‑Code** paths for preview customers.
**Initial customer visibility** where needed: selected **BCH** cards or views for preview scope.
**Optional IcM enrichment to pilot queues**; **Investigate** enabled for preview scope.
**Documentation** (feature overview, limitations) and **feedback loops**.
**Auto‑Comms** typically **off** (or restricted) unless explicitly required for pilot customers.
**Criteria:**
Stable detection pipeline.
Validation mechanisms (shadow, escrow, A/B, backtesting).
Basic UX (may be incomplete but functional).
Early documentation available.
Support model defined (but not full SLA).
Clear feedback loops.
**Excludes:**
Compliance sign‑off.
Full sovereign cloud rollout.
Fully automated operations.

## Phase 3 — Public Preview

**Purpose:** Broader exposure to Azure services and customers with preview disclaimers.
**Intended consumers:**
All Azure services (opt‑in).
Customers enabling preview via portal or GitOps.
**Supported Brain capabilities in this phase:**
**End‑to‑end integration** across pipeline → configuration → visibility.
**BCH dashboards/cards** for preview surfaces.
**IcM enrichment** to service queues under preview terms.
**Brain Investigate** workflows for triage and RCA.
**GitOps + Portal** configuration fully supported for opt‑in.
**Impact Assessment** active; **incident creation** fully wired into preview flows.
**Operational metrics** published; **automated regression** in place.
**Auto‑Comms** available as **opt‑in** with preview disclaimers.
**Criteria:**
Full end‑to‑end integration (pipeline, config, visibility).
BCH dashboards populated.
IcM enrichment works.
GitOps + portal configuration supported.
Impact correlation functional.
Operational metrics published.
Regression testing automated.
No manual ops in standard flows.

## Phase 4 — General Availability (GA)

**Purpose:** Fully supported, production‑grade capability meeting Azure‑wide quality bars.
**Intended consumers:**
All Azure customers.
All clouds (public + sovereign) where applicable.
**Supported Brain capabilities in this phase:**
**All customer‑facing surfaces** on by default where applicable: **BCH**, **Investigate**, **IcM enrichment**, **Auto‑Comms**.
**Detection Agent** + **Impact Agent** as production dependencies for detection and customer‑impact semantics.
**GitOps/Config‑as‑Code** + **Portal** as standard configuration paths.
**Deployment Health integration** with safe deployment systems (EV2/AzDeployer) and health checks.
**Brain Analytics** dashboards for product performance and quality telemetry.
**Multi‑cloud** coverage (national/air‑gapped) when applicable.
**Criteria:**
### 4.1 Product Readiness

No must‑fix bugs.
All acceptance criteria met.
Mature UX and API contracts.
Configuration‑as‑code fully supported.
### 4.2 Security & Compliance

Full compliance sign‑off.
SDL, s360, SFI checks completed.
Vulnerability management cleared.
### 4.3 Operational Excellence

Full observability (metrics, logs, traces).
SLAs/SLOs documented + met.
On‑call rotation + readiness completed.
Scale, load, and performance validated.
### 4.4 Documentation & Learning

Public docs, FAQs, troubleshooting guides.
Migration guides.
Templates + examples.
### 4.5 Multi‑Cloud Readiness

Sovereign, air‑gapped variants validated.
All dependencies available.
### 4.6 Customer Outcomes

Demonstrated improvements (precision, recall, TTO, coverage).
Ongoing KPI monitoring defined.

## 4. Internal Validation Modes (Not Rollout Stages)

These modes are often confused with rollout phases but instead are **internal quality mechanisms**.
### Shadow Mode

Runs detection but never declares outages. Used for safety validation.
### Escrow Mode

Requires manual confirmation before declaring outages. Quality gate but not a product stage.

## 5. Summary Table


## 6. Recommendations / Next Steps

Publish this document in the AIOps EngHub repo.
Create a shared "Rollout Readiness Matrix" mapping required capabilities per stage.
Add lifecycle definitions to planning (Epics, Features, Monitors).
Standardize naming: **Experimental → Pilot → Private Preview → Public Preview → GA**.

## 7. Delivery Components (from deliver.md)




| Sub‑dimension | ERL1 | ERL2 | ERL3 | ERL4 |
| --- | --- | --- | --- | --- |
| Setup effort | Manual, ad‑hoc | Manual, documented | Automated flows | Automated + multi‑cloud |
| Support burden | Ad‑hoc, internal only | Best effort (unless hi pri customer), scrappy on-call TSG | Best-effort responses & well-defined on-call TSG. Begin measuring eng-hrs per ticket | <X eng-hours per customer ticket for the feature |
| Runtime environment | Siloed/side pipeline | In standard Brain agents & pipeline | In standard Brain agents & pipeline | In standard Brain agents & pipeline |
| Documentation | Tribal knowledge/ internal docs | Minimal customer docs | Complete customer docs | Complete customer docs |
| Feedback loop | Brain team makes manual adjustments | Brain team can run ad-hoc automations | Customer can run ad-hoc automations | Brain continuously runs optimizing automations |
| Telemetry & analytics | Minimal | Basic ADX dashboards can be used | SLOs& GHS monitors used in production | SLOs& GHS monitors used in production |
| Sovereign cloud | No | N/A/Planned | Planned/partial | Full |
| Resiliency model | None | Best‑effort | Regionally resilient | Failover + recovery |
| Security & compliance | None | Baseline | Advanced checks | Full SDL/SFI/QEI |
| Scalability | Not validated | Small‑scale OK | Preview‑scale validated | Azure or company‑wide validated |




| Rollout Stage | Engineering Readiness | Capability Readiness | Meaning | Exit Criteria |
| --- | --- | --- | --- | --- |
| Proof‑of‑Concept (POC) | ERL1 | – | Early experimentation; unsafe to scale; no customers | Core detection logic works in isolation

Basic telemetry exists

Prototype does not impact production

Manual tests validate core hypothesis |
| Pilot | ERL1 → ERL2 | CRL1 | Core value validated with design partners; operations still highly manual | Running in standard Brain agents/pipelines

Manual config & tuning documented

Basic IcM enrichment + outage declaration

Can support ≤5 early‑adopter services |
| Private Preview** | ERL2 | CRL1–CRL2 | Safe to operate manually for a small set of real customers; partial E2E experience | Manual support burden is predictable

Feedback loop (backtesting/tuning) works manually
 
BCH visibility and Investigate available for subset

Documentation published for preview customers

Can support tens of services reliably |
| **Public Preview | ERL3 | CRL2–CRL3 | Automatically operable at scale; strong customer experience but not fully compliant/resilient | Automated config (Portal+GitOps)fully supported

Automated validation/guardrails enabled

BCH + Investigate + Auto‑Diag surfaces functional

Regional resiliency validated

Support SLA established

Can support hundreds of services |
| General Availability (GA) | ERL4 | CRL3-4 | Full production: resilient, compliant, multi‑cloud, complete enterprise experience | Full SDL/SFI/QEI compliance

Multi‑cloud deployment validated

End‑to‑end UX parity + extensibility

Failover & recovery tested

Defined SLAs/SLOs with on‑call readiness

Capacity validated for all Azure/MSFT services |




| Area | Requirement | ERL1 | ERL2 | ERL3 | ERL4 | Evidence / Link |
| --- | --- | --- | --- | --- | --- | --- |
| Setup Effort | Deployment & config flows | Manual & brittle | Manual but documented | Automated (Portal/GitOps) | Automated + multi‑cloud |  |
| Support Burden | Onboarding, debugging, escalations | Ad‑hoc | Best‑effort, engineer-driven | Runbook-driven + SLA | SLO/SLA enforced |  |
| Runtime Environment | Where the feature executes | Siloed prototype | In standard Brain agents | Hardened in production agents | Multi‑cloud hardened |  |
| Documentation | Internal + customer docs | Tribal knowledge | Minimal internal docs | Full internal + customer docs | Public, complete |  |
| Feedback Loop | Backtesting, tuning, validation | Manual | Manual, repeatable | Automated validation/tuning | Continuous auto‑optimization |  |
| Telemetry & Analytics | Observability + diagnosability | Minimal | SLOs defined but weak | SLOs + health used in prod | GA‑grade telemetry |  |
| Sovereign Cloud | Deployment constraints | None | Planned | Partial validation | Full validation |  |
| Resiliency Model | Failure modes & recovery | No resiliency | Best‑effort | Regional baseline | Full failover + recovery |  |
| Security & Compliance | SDL/SFI/QEI | None | Baseline | Advanced controls | Full compliance |  |
| Scalability | Capacity, perf, cost | Not validated | Small scale | Preview scale | Full Azure/company scale |  |




| Area | Requirement | CRL1 | CRL2 | CRL3 | CRL4 | Evidence / Link |
| --- | --- | --- | --- | --- | --- | --- |
| Core Detection Value | Detection + outage + IcM | - | - | - | - |  |
| Setup & Configuration | Brain UI & GitOps | Brain-managed GitOps | UI self‑service + correlation | Rich config + auto‑diagnosis | Extensible config logic |  |
| Understanding the Issue | Investigate experience | Basic evidence | Clear Investigate flows | Auto-Triage + Auto‑Diagnosis | Full RCA + extensibility |  |
| Operational Awareness | BCH, dashboards, health views | Minimal | BCH overview | Recovery dashboard + SLOs | Full analytics + insights |  |
| Customer Communication | Auto‑Comms | N/A | Supported | Scenario-complete | Fully integrated + configurable |  |
| Cross‑Signal Intelligence | Correlation + policy | Minimal | Incident/outage correlation | Broad correlation + policy | Full E2E correlation & extensibility |  |




| Stage | Audience | Purpose | Key Criteria |
| --- | --- | --- | --- |
| Experimental | Internal | Explore feasibility | Prototype pipelines; no UX/docs; manual validation |
| Pilot | Internal + Partners | Validate capability | Works for limited scope; basic telemetry; manual ops |
| Private Preview | Select customers | Validate in real-world | Stable pipelines; validation mechanisms; basic docs |
| Public Preview | Broad customers | Harden the feature | Full E2E integration; dashboards; GitOps; no manual ops |
| GA | All customers | Full production | Compliance, scale, docs, SLA, sovereign-ready |




| Phase | Component Area | Items |
| --- | --- | --- |
| Phase 1: Core Detection Pipeline | Health Evaluation | Feature works in health calculation logic |
|  | Detection Logic | Feature is considered by detection models |
|  | Incident Creation | Feature metadata included in incident records |
|  | Impact Assessment | Feature affects impact calculation (if applicable) |
| Phase 2: Customer Configuration | Brain Configuration (UI) | Feature is configurable via Jarvis portal |
|  | Brain Configuration (GitOps) | Feature supports Git-based configuration |
|  | Documentation | Feature has customer-facing docs (how‑to guides, FAQs) |
|  | Validation | Configuration validation prevents invalid settings |
| Phase 3: Customer Visibility | BCH Dashboard | Feature data is visible in Brain Cloud Health |
|  | IcM Enrichment | Feature context included in incident tickets |
|  | Brain Investigate | Feature supports root cause analysis workflows |
|  | Auto‑Communications | Feature included in customer notifications (if relevant) |
| Phase 4: Integration & Operations | Deployment Health | Integrated with safe deployment systems (if relevant) |
|  | Brain Analytics | Feature performance tracked in telemetry |
|  | Multi‑Cloud | Feature deployed to sovereign/air‑gapped clouds |

