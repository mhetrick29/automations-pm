# Intelligent Monitors: Unified, AI-Driven Detection for Azure Services

## Version & People
- **Status**: Draft
- **Author(s)**: Matthew Hetrick
- **Approvers/Stakeholders**: Brain Leadership, AI Monitoring-Pipeline, AI Monitoring-Actions, AI Experiences
- **DACI/RACI**: See [Ownership](#ownership)
- **Links**: 
  - [ADO Epic 34640109](https://dev.azure.com/msazure/One/_workitems/edit/34640109)
  - [Prototype: brain-gen2-monitor](https://brain-gen2-monitor.vercel.app/)
  - [Proposal for extensible monitors.docx](./Proposal%20for%20extensible%20monitors.docx)
  - [Definitions](#definitions)
---

## 1) Executive Summary (One Page)

### Problem
Today, Brain monitors are fragmented across per-SLI, per-model configurations that create significant friction for service teams. **Getting to outage mode is hard**—teams must manually validate each SLI-model combination through a lengthy escrow process. **High coverage requires manual support**—many monitors stall before reaching production. **Innovation is constrained**—every new detection model requires a new monitor type with new parameters, increasing cognitive load and support costs. The result: ~15% of outages are detected by monitors but manually declared because customers lack confidence in Brain's automated decisions.

### Proposal
Introduce **Intelligent Monitors**—a unified, extensible customer-facing monitor that can use multiple signals and models under a single configuration surface. Brain will abstract the complexity of detection models, auto-select and weight models based on signal characteristics, and provide preview/what-if analysis before enablement. Services get an out-of-the-box intelligent monitor that uses all their high-quality signals—they simply review the preview and enable.

### Expected Outcomes
1. **Faster time-to-outage-mode**: Reduce onboarding friction by 50%+ through unified configuration and guided setup
2. **Higher coverage**: Enable 100% of services with quality SLIs to reach outage mode with minimal manual support
3. **Improved precision**: Leverage multi-signal detection (OPM) to reduce false positives and increase confidence
4. **Future-proof architecture**: New models plug into existing monitors without customer action

### The Ask
- Cross-team engineering investment: AI Experiences (UX), AI Monitoring-Pipeline (config), AI Monitoring-Actions (detection), AI Models (OPM integration)
- Partnership with 3-5 pilot services (OPM candidates) for V1 validation by end of March 2026
- Leadership support for IM as the default monitor paradigm by Fall 2026

### TL;DR
Intelligent Monitors unify Brain's fragmented per-SLI/per-model approach into a single, AI-driven monitor that services can confidently enable with minimal configuration—transforming the experience from *"one monitor per SLI × model with manual tuning"* to *"one intelligent monitor that Brain auto-tunes across your signals."*

---

## 2) Users & Scenarios

### Primary Personas: Service Teams (Customers)

| Persona | Description |
|---------|-------------|
| **DRI (On-call Engineer)** | Responds to outages; needs Brain to detect reliably without constant tuning or noise |
| **Service Owner/SRE Lead** | Accountable for Brain coverage and precision; wants confidence in detection before enabling outage mode |
| **Config Admin** | Manages Brain monitor setup; wants simple, consistent configuration without per-model complexity |

### Secondary Personas: Internal (Brain)

| Persona | Description |
|---------|-------------|
| **Brain Product Team** | Needs to ship new detection capabilities without creating new monitor paradigms |
| **Brain Support** | Handles tuning requests; needs reduced support load and self-service tools for customers |
| **Brain Platform Team** | Maintains detection infrastructure; needs extensible architecture for new models |

### Key Scenarios

1. **First-Time Onboarding**: New service integrates SLIs with Brain. Instead of creating separate monitors per SLI+model, they get an out-of-the-box intelligent monitor. They preview detection results, confirm settings, and enable—all in one flow.

2. **What-If Analysis Before Enablement**: Service owner is hesitant to enable outage mode. They use the what-if preview to see "what Brain would have detected in the last month" against their actual outages, gaining confidence before enabling.

3. **Noise Tolerance Adjustment**: Team receives too many incidents. They adjust the noise tolerance slider, see a preview of how that affects detection results, and apply the change—no engineering support needed.

4. **Multi-Signal Detection**: Service has 5 SLIs configured. Instead of managing 5+ monitors, the intelligent monitor combines signals using OPM to detect outages more accurately than any single SLI could.

5. **New Model Auto-Adoption**: Brain ships an improved detection model. Existing intelligent monitors automatically benefit without customer action—Brain logs the change and notifies if needed.

---

## 3) Problems

### 3.1 External (Customer/DRI) Pain

| Problem | Evidence | Tied to Scenario |
|---------|----------|------------------|
| **Hard to get to outage mode** | Many monitors stall in escrow; services require manual support to progress | First-Time Onboarding |
| **Lack of confidence in detection settings** | Customers hesitate to enable outage mode without understanding what Brain will do | What-If Analysis |
| **High tuning support burden** | Frequent requests to "tune detection parameters"—currently requires eng support | Noise Tolerance Adjustment |
| **Monitor overload** | Services with 5+ SLIs must manage 5+ monitors with different parameters per model | Multi-Signal Detection |
| **Confusion about detection settings** | Different monitor types have different param names (CRID, baseline, thresholds) | All scenarios |

### 3.2 Internal (Brain/Ops) Pain

| Problem | Evidence | Impact |
|---------|----------|--------|
| **Innovation constrained** | Every new model = new monitor type + new UX + new params | Slows model adoption, increases eng cost |
| **Support volume** | ~30% of support requests relate to detection/monitor configuration | High support load, slow resolution |
| **Low visibility into production** | Customers can't see live detection performance before enabling | Trust gap, adoption friction |
| **Fragmented configuration** | Settings spread across Brain config, SLI authoring, GitOps files | Cognitive load, error-prone |

---

## 4) Metrics, Goals & Non-Goals

### Goals (P0/P1)

| Goal | Target Metric | Priority |
|------|---------------|----------|
| Services can confidently enable outage mode without engineering support | ≥80% self-service enablement for new monitors | P0 |
| Reduce time from SLI onboarding to outage mode | 50% reduction in median time-to-outage-mode | P0 |
| Services gain visibility into detection behavior before enabling | 100% of IM-enabled services use preview/what-if at least once | P0 |
| Reduce detection-related support requests | ≥40% reduction in tuning support tickets | P1 |
| New detection models integrate seamlessly | New models deployable without customer-facing monitor changes | P1 |
| Multi-signal detection improves precision | ≥10% improvement in precision for multi-signal services vs single-SLI | P1 |

### Non-Goals (to prevent scope creep)
- **Not deprecating single-SLI monitors in V1**: Existing monitors continue to work; migration comes later
- **Not building chat-based configuration in V1**: Natural language config is V3+ exploration
- **Not supporting non-SLI signals in V1**: External signals (Geneva monitors, DownDetector) are separate workstreams (see Brain Skills)
- **Not building custom detection logic**: Services needing custom rules should use Brain Skills framework
- **Not changing incident experience in V1**: Focus is on configuration; incident enhancements are future phases

### Success Metrics (SMART)

| Metric | Baseline | Target | By | Source/Query | Owner |
|--------|----------|--------|----|--------------|-------|
| Time-to-outage-mode (median) | ~4 weeks | ≤2 weeks | June 2026 | Brain Analytics | Analytics Team |
| Self-service monitor enablement | ~50% | ≥80% | June 2026 | Support ticket analysis | PM |
| Detection-related support tickets | ~30% of total | ≤20% of total | Sept 2026 | ServiceNow | Support Lead |
| Services using IM | 0 | ≥10 | March 2026; ≥50 by June | IM registry | PM |
| Preview/what-if usage | N/A | 100% of IM-enabled services | June 2026 | Telemetry | Analytics Team |
| Precision improvement (multi-signal) | Single-SLI baseline | +10pp precision | Sept 2026 | Detection audit | Model Team |

---

## 5) Proposed Solution (WHAT → minimal HOW)

### Overview
An **Intelligent Monitor** is a unified, customer-facing monitor that abstracts detection model complexity. It can use multiple signals (SLIs), applies Brain's best detection models automatically, and provides preview/what-if analysis for customer confidence. Services configure policies (not model parameters), and Brain handles the rest.

### Capabilities (customer-facing)

| Priority | Capability | Customer Usage |
|----------|------------|----------------|
| **P0** | **Out-of-the-box Intelligent Monitor** | New services get a pre-configured IM using all their quality SLIs. Review preview, enable—done. |
| **P0** | **What-If Preview** | See "what Brain would have detected" over a historical period before enabling or changing settings. |
| **P0** | **Noise Tolerance Slider** | Adjust detection sensitivity via a simple slider; see impact immediately in preview. |
| **P0** | **Unified Policy Configuration** | Configure IcM team, severity, outage mode, auto-comms in one place—no per-model params. |
| **P0** | **Scope Selection** | Select which scopes (Region, Zone, etc.) Brain should monitor. |
| **P1** | **Detection Results Table** | See past outages the monitor detected with explanations and evidence. |
| **P1** | **SLI Quality Insights** | Model provides feedback on which SLIs are most/least useful, recommends SLIs to add/remove. |
| **P1** | **Config-as-Code** | Define IM settings in YAML for GitOps workflows (power users). |
| **P2** | **Auto-Tuning Feedback Loop** | Users label FP/FN; Brain auto-adjusts model weights over time. |
| **P2** | **Chat-Based Q&A** | Ask questions about detection results, get explanations, configure via natural language. |

### Phased Approach

#### V1 (MVP) — Intelligent Monitor for OPM Pilot Services (March 2026)
**Summary**: Deliver the initial intelligent monitor experience for services using the OPM (Outage Prediction Model) multi-signal model. Focus on preview, noise tolerance, and unified configuration.

**Customer gets**: 
- Unified IM configuration surface in Brain UX
- What-if preview of detection results over historical data
- Noise tolerance slider with live preview impact
- Scope selection for detection
- Policy configuration (IcM team, severity, outage mode)

**Problems solved**: 
- Hard to get to outage mode → preview gives confidence
- Confusion about settings → unified policies instead of model params
- High tuning support → self-service noise slider

**Success criteria**:
- 3-5 pilot services onboarded with IM
- 80%+ use what-if preview before enabling
- Zero new tuning support tickets from pilot services

#### V2 — Expanded Model Support & SLI Insights (June 2026)
**Summary**: Extend IM to support all Brain detection models (not just OPM). Add SLI quality insights and config-as-code.

**Customer gets**: 
- IM works with any Brain detection model
- SLI quality recommendations from the model
- Config-as-code for IM settings
- Enhanced detection results table with explanations

**Problems solved**: 
- Monitor overload → one IM regardless of underlying models
- Innovation constrained → new models auto-integrate
- Low visibility → detection results table

**Success criteria**:
- 50+ services using IM
- ≥40% reduction in detection support tickets
- New model (post-OPM) integrated without new monitor type

#### V3+ — Auto-Tuning & AI-Driven Configuration (Fall 2026+)
**Summary**: Enable continuous improvement through FP/FN feedback loops, auto-tuning, and natural language interaction.

**Customer gets**: 
- FP/FN labeling with Brain auto-adjustment
- Chat-based Q&A and configuration
- Cross-service learning (with privacy)

**Problems solved**: 
- Ongoing tuning burden → Brain self-improves
- Complexity for new users → chat guides setup

**Success criteria**:
- IM is the default monitor paradigm for new services
- Measurable precision improvement from auto-tuning
- Chat usage for ≥30% of configuration changes

---

## 6) Dependencies, Integrations & Rollout

### Brain Experience & E2E Considerations

**Configuration**: 
- IM configuration is the single pane for detection settings
- Default = Brain's recommended settings; customers can adjust policies
- Existing per-SLI monitor settings remain for legacy monitors (no forced migration in V1)

**What-If / Preview Experience**:
- Show projected detections vs. actual outages over historical period
- Dynamic table updates as user adjusts noise tolerance or scopes
- Clear explanations for why Brain would/wouldn't have detected each outage

**Incident Experience** (future):
- When IM detects, incident notes which signals contributed
- Brain Investigate shows per-SLI breakdown for debugging

### Ecosystem Integration/Dependencies

| Brain Team | Anticipated Work |
|------------|------------------|
| **AI Experiences** | Build IM configuration UX, what-if preview, detection results table, monitor list integration |
| **AI Monitoring-Pipeline** | IM config schema, config-as-code support, policy storage |
| **AI Monitoring-Actions** | Detection evaluation using IM settings, multi-model orchestration |
| **AI Platform** | Backtesting/simulation service for what-if preview |
| **AI Models** | OPM integration with IM settings, SLI quality insights API |
| **Auto-Diagnosis** | None for V1 |

| External Partner | Integration |
|------------------|-------------|
| **SLO/SLI Platform** | IM consumes SLIs as primary signals |
| **IcM** | IM creates incidents; future: attach IM metadata to incidents |
| **ARG (Azure Resource Graph)** | Scope selection queries ARG for available scopes |

### Rollout, Change Management & Customer Comms

**Preview cohort (V1)**: 
- 3-5 services with OPM already onboarded (candidates: OPM pilot list)
- Feature flag: `intelligent-monitor-enabled` at service level

**Rollback criteria**: 
- If IM causes >5% degradation in precision vs. existing monitors, disable and revert
- If critical P0 bugs, disable creation of new IMs

**Comms**: 
- Announce in Brain newsletter and AIOps PM Weekly
- 1:1 onboarding with pilot services
- "What's new" banner in Brain UX

**Migration plan** (post-V1):
- Existing per-SLI monitors continue unchanged
- Phased migration tooling in V2+ (preview existing monitor as IM, migrate when ready)

### Ownership

| Phase | Driver | Accountable | Consulted | Informed |
|-------|--------|-------------|-----------|----------|
| V1 Design | Matthew Hetrick (PM) | Jeffrey Sun (Exp Lead) | Model, Platform, Actions | Brain Leadership |
| V1 Build | Jeffrey Sun (Exp), Yueli Lu (Platform) | Exp + Platform Leads | Model Team (Meng Jin, Youjiang Wu) | PM |
| V1 Pilot | Matthew Hetrick | Jeffrey Sun | Pilot Services, Support | Leadership |
| V2+ | Matthew Hetrick | Exp + Platform + Model Leads | All Brain teams | Leadership |

---

## 7) Risks, Alternatives & Open Questions

### Key Decisions

| Decision | Options Considered | Rationale | Date | Owner |
|----------|-------------------|-----------|------|-------|
| Start with OPM as the initial multi-signal model | (a) Custom fusion logic, (b) OPM, (c) Wait for new model | OPM is mature, already piloting with services, proven multi-signal approach | Jan 2026 | PM |
| Unified configuration over per-model params | (a) Expose all model params, (b) Abstract into policies | Policies reduce cognitive load; power users can use GitOps | Jan 2026 | UX + PM |
| What-if preview as core V1 capability | (a) Enable without preview, (b) Require preview before enable | Preview builds confidence and reduces support—worth the investment | Jan 2026 | PM |
| Keep legacy monitors alongside IM | (a) Force migration, (b) Deprecate legacy, (c) Run in parallel | Minimize disruption; services with tuned monitors shouldn't be forced to change | Jan 2026 | PM |

### Top Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| What-if preview is too slow for large services | Medium | High | Invest in backtesting service optimization; limit preview window (e.g., 30 days) |
| OPM precision doesn't meet expectations | Medium | High | Validate with pilot services before GA; fallback to single-model mode |
| Customers confused about IM vs legacy monitors | Medium | Medium | Clear naming, UX guidance, in-product education |
| Model team bandwidth for SLI insights API | Medium | Medium | V2 scope—can descope if needed; V1 works without insights |
| Resistance to new paradigm from power users | Low | Medium | Maintain config-as-code and "advanced" mode for power users |

### Alternatives Considered

| Alternative | Why Not Chosen |
|-------------|----------------|
| **Improve existing per-SLI monitors only** | Doesn't solve multi-signal vision, doesn't reduce monitor overload, limits innovation |
| **Build custom fusion logic per service** | Doesn't scale; already tried ad-hoc, creates support burden |
| **Wait for next-gen detection platform** | Too slow; services need help now; IM can evolve with platform |
| **Start with Geneva monitor integration** | Different workstream (Brain Skills); IM focuses on SLI signals first |

### Open Questions

- **Q1**: What's the exact scope selection UX? → To be designed with UX team
- **Q2**: How do we show per-SLI contributions in a multi-signal detection? → Model team to propose
- **Q3**: Should noise tolerance be a slider (continuous) or presets (low/medium/high)? → User research needed
- **Q4**: How do we handle services with only 1 SLI (single-signal case)? → Default to best single-SLI model
- **Q5**: What's the migration path for services with highly tuned legacy monitors? → V2 tooling to be defined

---

## Appendix

### Definitions

| Term | Definition |
|------|------------|
| **Intelligent Monitor (IM)** | A unified, customer-facing monitor that abstracts detection models and can use multiple signals |
| **Model Monitor (Legacy)** | A per-SLI, per-model monitor (e.g., "XStore SLI1 with Evidence-Based model") |
| **OPM (Outage Prediction Model)** | Multi-signal detection model that combines multiple SLIs to detect outages |
| **Evidence-Based (EB)** | Single-SLI detection model using statistical evidence of deviation |
| **Standard Health (StdHealth)** | Single-SLI detection model using health scoring |
| **Escrow Mode** | Pre-production mode where detection fires but doesn't create incidents |
| **Outage Mode (AOD)** | Production mode where detection triggers automatic outage declaration |
| **What-If Preview** | Simulation showing what Brain would have detected over historical data |
| **Noise Tolerance** | Customer-facing sensitivity setting; maps to internal model thresholds |
| **Scope** | Dimension for detection (e.g., Region, Zone, Cluster) |
| **SLI (Service Level Indicator)** | Quantitative measure of service behavior (e.g., availability, latency) |
| **SIA (Service Impact Assessment)** | Criteria for classifying outage severity and customer impact |
| **Policy** | Customer-configurable behavior (e.g., severity, IcM team, outage mode) vs. model parameters |

### Conceptual Model: Models in Agents

```
┌─────────────────────────────────────────────────────────────────┐
│                    Intelligent Monitor                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Customer Policies: IcM Team, Severity, Outage Mode, ... │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Brain Detection Agent                       │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │   OPM   │  │   EB    │  │ StdHlth │  │ Future  │    │   │
│  │  │ (multi) │  │(single) │  │(single) │  │  Model  │    │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │   │
│  │       │            │            │            │          │   │
│  │       └────────────┴────────────┴────────────┘          │   │
│  │                        │                                 │   │
│  │              Model Selection & Weighting                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│                    Detection Decision                           │
│                    (Outage / Incident / None)                   │
└─────────────────────────────────────────────────────────────────┘
```

### High-Level Detection Pipeline (Conceptual)

```
Signals (SLIs)          IM Configuration         Detection Agent           Actions
━━━━━━━━━━━━━━         ━━━━━━━━━━━━━━━━         ━━━━━━━━━━━━━━━          ━━━━━━━━
     │                       │                        │                      │
     │ SLI 1 metrics         │ Scopes: Region         │                      │
     │ SLI 2 metrics  ───►   │ Noise: Medium   ───►   │ OPM evaluates  ───►  │ Create IcM
     │ SLI 3 metrics         │ Outage Mode: On        │ Threshold met        │ Outage Decl
     │                       │ Team: XStore-DRI       │ Evidence combined    │ Notify DRI
     │                       │                        │                      │
```

### Configuration Schema (Draft)

```yaml
apiVersion: brain.azure.com/v1
kind: IntelligentMonitor
metadata:
  name: xstore-intelligent-monitor
  service: XStore
  version: 1.0.0
spec:
  # Signals included in this monitor
  signals:
    - type: sli
      ids: ["sli-availability-001", "sli-latency-002", "sli-errors-003"]
      includeAll: false  # or true to auto-include all quality SLIs
  
  # Detection scopes
  scopes:
    - dimension: Region
      values: ["*"]  # All regions, or specific list
  
  # Policies
  policies:
    noiseTolerance: medium  # low | medium | high
    outageMode: enabled
    incidentSeverity: auto  # auto | sev2 | sev3
    icmTeam: XStore-Oncall
    autoComms:
      enabled: false
      template: null
  
  # Enrichments
  enrichments:
    tsg: brain-default
    diagnostics:
      crashInsights: true
      logInsights: false
```

### Related Documents
- [Brain Skills Spec](./Brain%20Skills%20Spec.md) — Extensibility framework for custom service logic
- [Proposal for extensible monitors.docx](./Proposal%20for%20extensible%20monitors.docx) — Original proposal document
- [Intelligent Monitors Product Talks Deck.pptx](../presentations/Intelligent%20Monitors_Product%20Talks%20Deck.pptx) — Vision presentation

### ADO Work Items

| Type | ID | Title | Owner | State |
|------|-----|-------|-------|-------|
| Epic | [34640109](https://dev.azure.com/msazure/One/_workitems/edit/34640109) | Service level Brain monitors (multiple signals, easy configuration) | Matthew Hetrick | New |
| Feature | [35524641](https://dev.azure.com/msazure/One/_workitems/edit/35524641) | [Platform] Brain team can edit the detection configuration for intelligent monitors via config as code | Yueli Lu | Active |
| Feature | [34839765](https://dev.azure.com/msazure/One/_workitems/edit/34839765) | Intelligent monitors support scope selection for OPM pilot services | Matthew Hetrick | New |
| Feature | [36173777](https://dev.azure.com/msazure/One/_workitems/edit/36173777) | [Experience] Services can add a new intelligent monitor | Jeffrey Sun | New |
| Feature | [36559481](https://dev.azure.com/msazure/One/_workitems/edit/36559481) | [Experience] Implement the details view of intelligent monitor | Kevin Wilkinson | New |
| Feature | [36559532](https://dev.azure.com/msazure/One/_workitems/edit/36559532) | [Experience] Show unified intelligent monitor in the monitor list page | Kevin Wilkinson | New |
| Feature | [36546022](https://dev.azure.com/msazure/One/_workitems/edit/36546022) | [Model] OPM model honors intelligent monitor settings set by users | Meng Jin | New |
| Feature | [36559773](https://dev.azure.com/msazure/One/_workitems/edit/36559773) | [Model] OPM model exposes insights on SLIs and recommend SLIs to be selected | Youjiang Wu | New |
| Feature | [36622525](https://dev.azure.com/msazure/One/_workitems/edit/36622525) | Detection Agent use the intelligent monitor configuration to handle predictions (based OPM model) | Yueli Lu | New |

---

## Changelog
- v0.1.0 (2026-02-10): Initial epic spec draft synthesized from proposal documents, daily notes, and ADO work items.
