# Brain Domain Reference

Shared context for all agents working on Brain/AIOps products.
Source: eng.ms/docs/products/brain + internal team process docs.

---

## What is Brain

Brain is Microsoft's AI-powered health and monitoring system for Azure. It helps cloud service engineers understand service health status and manage outages quickly, improving service quality and reducing toil.

**Key impact metrics** (May–Oct 2024):
- Detect outages **68% faster** than without Brain integration
- Mitigate outages **45% faster** than without Brain
- Notify customers **26% sooner** than without Brain
- Prevent over **1,500** customer-impacting deployments monthly

Brain is currently in **Private Preview**, scoped to Azure Quality Critical Services (QCS). Public Preview is expected in 2026.

---

## Key Capabilities

| Capability | What it does |
|-----------|-------------|
| **Auto Detection** | AI-based monitors detect outages by ingesting SLI data and applying statistical models. Reduces configuration toil. |
| **Brain Cloud Health** | Visualizes cross-service impact — global, regional, per-service, and per-custom-scope health views. Used in Zone Down Drills. |
| **Auto Comms** | Automatically notifies impacted customers of outages. Reduces CritSit risk — Brain-declared outages are 3× less likely to have CritSits (13% vs 38%). |
| **Auto Triage** | Automatically identifies the service responsible for an outage using dependency health analysis. |
| **Auto Diagnosis** | AI-powered root cause analysis with minimal configuration. Locates the exact change causing regression. |
| **Deployment Health** | EV2 checks Brain health data during deployments and auto-stops unhealthy rollouts. |
| **Brain Analytics** | Tracks adoption, detection precision/recall, SLI quality, and time-to-outage metrics. |

---

## How Brain Works

```
SLI signals → Brain Detection → Outage Declaration → Intelligent Actions
                                                        ├── Auto Triage (find responsible service)
                                                        ├── Auto Diagnosis (root cause)
                                                        ├── Auto Comms (notify customers)
                                                        ├── IcM Incident (impact assessment)
                                                        └── Deployment Stop (halt EV2 rollouts)
```

1. **Brain detects customer impact.** Continually ingests SLI or service monitor data. When signals indicate a potential issue, Brain applies statistical models to determine if there's an outage.
2. **Detection triggers intelligent actions.** Creates IcM incidents, runs Auto Triage to find the DRI, runs Auto Diagnosis for immediate insights, sends Auto Comms to customers, and halts deployments.
3. **Analytics improve detection.** Health modeling identifies opportunities to improve signal quality, add SLIs for missed outages, and auto-tune detection precision.
4. **Feedback helps Brain learn.** Automated actions provide system feedback to optimize future responses.

---

## Brain Teams

| Team | Responsibility |
|------|---------------|
| **AI Models** | New models, training, inference |
| **AI Platform** | Orchestration, scheduling, execution |
| **AI Monitoring-Pipeline** | Configuration, data flow, signals |
| **AI Monitoring-Actions** | Impact assessment, notifications, escalation |
| **Auto-Diagnosis** | Root cause analysis, diagnostics, remediation |
| **AI Experiences** | UI, incident experience, dashboards |

## External Ecosystem Partners

- **SLO/SLI Platform** — Service-level objective and indicator infrastructure
- **ARG** (Azure Resource Graph) — Resource discovery and querying
- **IcM** — Incident management system
- **EV2** — Managed deployment system (checks Brain health for deployment stops)
- **Geneva/MDM** — Metrics and monitoring infrastructure

---

## Core Domain Model

```
signals → scopes → models → monitors → policies/actions
```

- **Signals**: Telemetry data points (metrics, logs, traces) from monitored services
- **Scopes**: Logical groupings that define what a monitor observes (e.g., per-resource, per-region, per-scale-unit, custom domains)
- **Models**: AI/ML models that analyze signals within scopes to detect anomalies. Brain correlates multiple signals simultaneously, looking for pattern anomalies vs. single-signal anomalies.
- **Monitors**: Configured detection units. Two types:
  - **Brain monitors** — Brain performs both detection and impact assessment using SLIs
  - **Brain-integrated service monitors** — Service performs detection, sends info to Brain for impact assessment
- **Policies/Actions**: Rules that determine what happens when a monitor fires (notify, escalate, auto-remediate)

### SLIs vs. Service Monitors

Brain can be used via two integration paths:

| Path | How it works | Capabilities |
|------|-------------|-------------|
| **SLIs (recommended)** | Author SLIs → Brain auto-creates monitors → Full capabilities | Auto Detection, Impact Assessment, Auto Outage Declaration, Auto Comms, Auto Triage, Brain Cloud Health, Deployment Stops |
| **Service monitors** | Configure monitor → IcM Automation reports to Brain | Auto Detection, Impact Assessment, Auto Outage Declaration, Auto Comms, Auto Triage. **No** Cloud Health, **no** Deployment Stops |

SLI quality is scored 1-4. Minimum score of 2 required for Brain onboarding. Score ≥3 enables automatic outage declaration for QCS services.

---

## Problems Brain Solves

Traditional health and monitoring systems suffer from:

| Challenge | Brain's approach |
|-----------|-----------------|
| **No holistic view** — individual metric monitors create alert storms | Brain correlates multiple signals simultaneously using ML |
| **Rising monitors & noise** — unmanageable number of monitors | Brain auto-tunes detection; centralizes monitoring logic |
| **Static thresholds** — hard to configure for low TTD + high precision + high recall | AI-based anomaly detection adapts without manual tuning |
| **No built-in automation** — detection only, no triage/comms/diagnosis | End-to-end: detect → triage → diagnose → communicate → stop deployments |
| **No quality measurement** — no feedback loops after monitor creation | Brain Analytics tracks precision, recall, TTD with continuous improvement |
| **No self-learning** — requires manual reconfiguration | Brain learns from historical data and feedback |

### Brain vs. Geneva Monitors

| Capability | Brain + SLIs | Brain-integrated monitors | Geneva monitors alone |
|-----------|-------------|--------------------------|----------------------|
| Brain Cloud Health | ✅ | ❌ | ❌ |
| Regional health view | ✅ | ❌ | ❌ |
| Reduced time to outage | ✅ | ❌ | ❌ |
| Auto-tuned alerts | ✅ | ❌ | ❌ |
| Auto deployment stoppage | ✅ | ❌ | ❌ |
| Auto outage declaration | ✅ | ETA 2026 | ❌ |
| Incident-to-health correlation | ✅ | ✅ | ❌ |
| Auto impact assessment | ✅ | ✅ | ❌ |
| Auto Comms + invite CM | ✅ | ✅ | ❌ |
| Auto Health Checks | ✅ | ❌ | ❌ |
| Diagnostic insights | ✅ | Manual | Manual |
| Dependency health (ETA 2026) | ✅ | ❌ | ❌ |
| Per-customer health (ETA 2026) | ✅ | ❌ | ❌ |

---

## Key Terminology

| Abbreviation | Term | Description |
|-------------|------|-------------|
| AIM | Azure Incident Manager | Coordinates incident response |
| ARG | Azure Resource Graph | Tool for querying Azure resources |
| ARM | Azure Resource Manager | Azure deployment and access control service |
| BCH | Brain Cloud Health | Global/regional/per-service health dashboard |
| CM | Communication Manager | Manages internal and external communications during incidents |
| CritSit | Critical Situation | Severity A/1 support request from Unified/Premier customer |
| DRI | Designated Responsible Individual | Handles live site incidents |
| EB | Error Budget | Anomaly detection model |
| EV2 | Express V2 | Managed deployment system |
| FN | False Negative | Missed detection (outage happened but Brain didn't catch it) |
| FP | False Positive | Noisy detection (Brain alerted but no real outage) |
| IcM | Incident Management | Microsoft incident management system |
| IM | Intelligent Monitors | Next-gen monitoring experience |
| OPM | Outage Prediction Model | Predicts outages before impact |
| QCS | Quality Critical Services | Azure services requiring highest quality bar |
| RHC | Resource Health Check | Interface for checking Azure resource health |
| SC | Status Code | Anomaly detection model for HTTP status codes |
| SIA | Standard Impact Assessment | Standardized impact assessment framework |
| SLI | Service Level Indicator | Quantitative measure of service performance |
| SLO | Service Level Objective | Target performance range for SLIs |
| TV | Traffic Volume | Anomaly detection model for traffic patterns |

### Outage Definition
An outage is an incident requiring collaboration across many services or resulting in customer impact. Brain's SLI-based default: an issue impacting ≥50 resources lasting ≥10 minutes (High Impact Outage definition).

---

## How We Work — Design Process

Brain follows a structured UX development process with 3 phases:

### PM Spec (target: 1 month)
- Weeks 1-2: Draft PM spec → PM subteam review
- Week 3: Iterate → PM team + Dev lead review
- Week 4: Sign-off from PM lead + Dev lead → Design kick-off

### UX Design (target: 1 month)
- Weeks 1-2: Frequent syncs (3-4×/week) between PM & design; 1 weekly sync with eng for progress
- Weeks 3-4: User interviews to validate designs; sync 1×/week with full team
- Exit: Design review with Brain LT

### Eng Implementation
- Weekly standups to align flow & functionality
- Bug bash ~1 week before deployment
- Exit: Final deployment review with PM, Eng, Design for sign-off

### Reviews
- **Design review**: Engineering signs off that design is ready to implement. Focus on users, problems, and how the design solves them.
- **Sign-off / fit and finish**: Design approves the implementation for release. Check fonts, spacing, accessibility, user testing.
- **Product Experience Reviews (PERs)**: Communicate vision outside the team to LT and other PMs. Framed around problems and how user flows solve them.

### Measurement & Iteration
After rollout, at least 1 iteration with pilot customers before broader release. Track: adoption (education campaigns), telemetry (clicks, time spent), explicit feedback (pilot conversations), deduplication (remove overlapping UX), success stories (QDD, MBR, newsletter).

---

## How We Work — Ownership Framework

### Epic & Feature Definitions
- **Epic**: Solution-oriented, time-bound deliverable. Defines end-of-semester state. 4 phases: Definition → Design → Execution → Release.
- **Top-Level Feature**: A product release enabling new or improved capabilities. Created by PM, delivery owned by Dev.
- **Child Features**: Engineering-defined work items required to deliver a top-level feature.

### Ownership Model
Each epic has a **PM Owner** and a **Dev Owner**:

| Role | Responsibilities |
|------|-----------------|
| **PM Owner** | Owns vision & definition. Defines epic, outcomes, success metrics. Drives cross-org alignment. Creates release announcements. Reports status. |
| **Dev Owner** | Owns dev design, execution, release. Defines technical design. Coordinates across dev teams. Reports engineering progress. Implements telemetry. |

### DACI Framework (for complex cross-team epics)
- **Driver (D)**: Owns the work, drives to completion
- **Approver (A)**: Final decision-making authority
- **Contributor (C)**: Provides input, helps with execution
- **Informed (I)**: Stays updated but not actively involved

### Forums
- **Semester planning**: Review epic definitions, features, dev designs
- **AIOps Monthly Shiproom**: Execution progress and action items
- **Feature launch review/demo**: Pre-release sign-off
- **Business check-ins**: Monthly/bi-monthly review of customer value delivered

---

## How We Work — Rollout Lifecycle

Brain uses a **two-axis readiness model** to evaluate feature maturity:

### Axis A: Engineering Readiness Levels (ERLs)
How many customers can be reasonably supported? Measured by operational toil and system robustness.

| Level | Name | Description |
|-------|------|-------------|
| ERL1 | Prototype / Unsafe to Scale | Manual, brittle setup; no resiliency; no customers |
| ERL2 | Manually Operable at Scale | Manual but documented; in standard Brain agents/pipelines; small customer set |
| ERL3 | Automatically Operable at Scale | Automated enablement (Portal + GitOps); automated validation; large customer set |
| ERL4 | Production / GA-Grade | Multi-cloud automation; full compliance; Azure-wide capacity |

### Axis B: Capability Readiness Levels (CRLs)
What end-to-end customer experience does the feature support?

| Level | Name | Key capabilities |
|-------|------|-----------------|
| CRL1 | Core Value Ready | Detection + outage declaration + incident creation + impact assessment |
| CRL2 | Reduce Friction | Investigate experience + UI config + incident correlation + Auto Comms |
| CRL3 | Expand Satisfaction | Deployment health + recovery dashboard + BCH views + Auto Triage/Diagnosis |
| CRL4 | E2E Completeness | Brain Analytics + extensibility hooks |

### Rollout Stage Mapping

| Stage | ERL | CRL | Audience | Key criteria |
|-------|-----|-----|----------|-------------|
| POC | ERL1 | — | Internal | Core logic works; no customers |
| Pilot | ERL1→2 | CRL1 | 3-5 design partners | Running in standard pipelines; manual ops documented |
| Private Preview | ERL2 | CRL1-2 | 20-50 services | Predictable support burden; docs published; BCH subset |
| Public Preview | ERL3 | CRL2-3 | Hundreds of services | Automated config; automated validation; regional resiliency |
| GA | ERL4 | CRL3-4 | All Azure/MSFT | Full compliance; multi-cloud; failover tested; SLAs defined |

### Internal Validation Modes (not rollout stages)
- **Shadow Mode**: Runs detection but never declares outages. For safety validation.
- **Escrow Mode**: Requires manual confirmation before declaring outages. Quality gate.

### SHIM Context
Brain operates as both a **workstream** (Service Health & Incident Management — driving Quality bowlers) and a **product** (easy to use, effective monitoring). The rollout lifecycle balances these: engineering readiness ensures the workstream delivers reliability, while capability readiness ensures the product delivers user value.
