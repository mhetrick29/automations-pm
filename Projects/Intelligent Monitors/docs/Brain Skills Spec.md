# Brain Skills: Extensible Expertise for Incident Intelligence

## Version & People
- **Status**: Draft
- **Author(s)**: Matthew Hetrick
- **Approvers/Stakeholders**: [TBD - Brain Leadership, AI Monitoring-Pipeline, AI Monitoring-Actions]
- **DACI/RACI**: See [Ownership](#ownership)
- **Links**: [Proposal for Brain Skills](./Proposal%20for%20Brain%20Skills.docx), [Definitions](#definitions)
---

## 1) Executive Summary (One Page)

### Problem
Brain's effectiveness depends on both global intelligence and service-specific expertise. Today, ~15% of all outages are detected by Geneva monitors but manually declared because these monitors are too noisy for automatic declaration. When services want Brain to apply custom escalation rules, enforce guardrails, or run custom impact queries, they must rely on ad hoc files, manual processes, or custom integrations. This slows onboarding, increases operational risk, and limits Brain's ability to deliver the right outcome for each service.

### Proposal
Introduce **Brain Skills**—a modular, contract-driven extension framework that lets services "teach" Brain their unique rules, lists, and logic. The first skill type focuses on **Custom Outage Assessment**: services define workflows for determining if a Geneva monitor detection is a real outage, enabling Brain to auto-declare instead of requiring manual DRI assessment.

### Expected Outcomes
1. **25-40% faster TTO** for outages where the outage declaration skill is used relative to previous geneva monitors. [Matt to validate number]
2. **Improved coverage** by integrating noisy geneva monitors [Matt to validate number]
[Matt to Delete] **+20pp improvement in correct severity/routing** for pilot services
3. **≥3 services onboarded** in H1 with Geneva monitor auto-declaration skills

### The Ask
- Engineering investment from AI Monitoring-Pipeline (skill registry) and AI Monitoring-Actions (skill invocation during detection)
- Partnership with 2-3 pilot services (high Geneva monitor outage volume) for V1 validation

### TL;DR
Services can now upload custom outage-declaration workflows to Brain, transforming the process from *"monitor fires → incident → human evaluates → declare outage"* to *"monitor fires → Brain evaluates → Brain declares outage"*—drastically reducing time-to-declaration for noisy monitors and quickly allowing users to integrate their existing monitors with Brain while investing in the long-term, paved path of SLIs.

---

## 2) Users & Scenarios

### Primary Personas: Service Teams (Customers)
| Persona | Description |
|---------|-------------|
| **DRI (On-call Engineer)** | Receives monitor alerts, currently must manually assess if detection is a real outage before declaring |
| **Service Owner/SRE Lead** | Defines escalation policies, guardrails, and critical customer lists for their service |
| **Config Admin** | Manages Brain configuration including monitor setup and now skill definitions |

### Secondary Personas: Internal (Brain)
| Persona | Description |
|---------|-------------|
| **Brain Detection Agent** | Needs structured way to invoke service-specific logic during detection evaluation |
| **Brain Platform Team** | Maintains skill registry, versioning, and governance |

### Key Scenarios (so far)
1. **Geneva Monitor Auto-Declaration**: DRI has a Geneva monitor that fires frequently but only ~30% are real outages. Today they manually triage each one. With Skills, they define assessment criteria and Brain auto-declares only real outages. 
2. **Critical Customer Escalation**: Service owner wants incidents affecting S500 customers to auto-escalate to Sev1. They provide the critical subscription list as a skill.
3. **Guardrail Enforcement**: SRE lead defines "never declare outages in canary regions" as a guardrail skill that Brain respects automatically.

---

## 3) Problems

### 3.1 External (Customer/DRI) Pain

| Problem | Evidence | Tied to Scenario |
|---------|----------|------------------|
| **Manual outage declaration for noisy monitors** | ~15% of outages are monitor-detected but manually declared. DRIs spend significant time triaging false positives. | Geneva Monitor Auto-Declaration |
| **No structured way to provide service-specific rules** | Services resort to ad hoc files, Slack threads, or custom code to communicate their rules to Brain | All scenarios |
| **Slow onboarding for custom logic** | Adding service-specific behavior requires engineering work and cross-team coordination | Critical Customer Escalation, Guardrails |

### 3.2 Internal (Brain/Ops) Pain

| Problem | Evidence | Impact |
|---------|----------|--------|
| **Brittle integrations** | Custom service logic is implemented as one-off code, hard to maintain and audit | Operational risk, tech debt |
| **No discoverability** | Team doesn't know what custom rules exist across services | Support load, debugging difficulty |
| **Agentic ecosystem gap** | BIC services and teams building "DRI agents" have no standard way to integrate knowledge with Brain | Limits Brain as a platform |

---

## 4) Metrics, Goals & Non-Goals

### Goals (P0/P1)

| Goal | Target Metric | Priority |
|------|---------------|----------|
| Services can reduce manual outage triage for Geneva monitors | ≥50% reduction in manual declarations for pilot services | P0 |
| Brain makes better decisions using service-supplied knowledge | +20pp correct severity/routing in pilot services | P0 |
| Extensibility is governed and auditable | 100% of skill invocations logged and traceable | P1 |
| Foundation for agentic/AI-driven workflows | Skills framework supports future skill types | P1 |

### Non-Goals (to prevent scope creep)
- **Not replacing the "paved path"**: Skills complement, not replace, Brain's default automated decision-making
- **Not building a general workflow engine**: V1 focuses on outage assessment, not arbitrary workflow automation
- **Not supporting non-Azure services**: V1 targets Azure services with Brain onboarding
- **Not building custom skill UX in V1**: Configuration via YAML/API first, UI comes later

### Success Metrics (SMART)

| Metric | Baseline | Target | By | Source/Query | Owner |
|--------|----------|--------|----|--------------|-------|
| Time-to-declaration for skill-enabled monitors | Manual avg ~15 min | ≤5 min (auto) | H1 2026 | Brain Analytics Outage Data | Analytics Team |
| Manual declarations from skill-enabled monitors | 100% manual | ≤50% manual | H1 2026 | Brain Analytics Outage Data | Analytics Team |
| Add later- Correct severity on first declaration | ~70% | 90% | H2 2026 | IcM audit | Actions Team |
| Services with active skills | 0 | ≥3 | H1 2026 | Skills registry | PM |
---

## 5) Proposed Solution (WHAT → minimal HOW)

### Overview
A **Brain Skill** is a modular, contract-driven extension that a service provides to Brain. Skills are registered in a central registry, versioned, and invoked automatically by Brain when relevant context matches.

### Capabilities (customer-facing)

| Priority | Capability | Customer Usage |
|----------|------------|----------------|
| **P0** | **Custom Outage Assessment Skill** | Service defines workflow (rules, KQL queries, criteria) for determining if a Geneva monitor detection is a real outage. Brain invokes this during detection and auto-declares if criteria met. |
| **P0** | **Skill Registration** | Config admin registers a skill via YAML in monitor configuration, specifying the monitor(s) it applies to and the assessment logic. |
| **P1** | **Critical Customer List Skill** | Service provides list of critical subscriptions/tenants (like S500 subscriptions). Brain escalates automatically if these are impacted. |
| **P1** | **Guardrail Skill** | Service defines rules like "never declare outages in canary regions." Brain respects these during all detections. |
| **P2** | **Impact Query Skill** | Service provides custom KQL for true impact assessment (e.g., SIA criteria). Brain runs query and uses result. |
| **P2** | **Custom Escalation Rule Skill** | Service defines rules like "if >1,000 subscriptions impacted, declare Sev1." |

### Phased Approach

#### V1 (MVP) — Custom Outage Assessment for Geneva Monitors
**Customer gets**: Ability to define outage-declaration workflows for Geneva monitors. Brain auto-declares real outages, filters noise.

**Problems solved**: Manual outage declaration enablement (coverage), noisy monitor assessment eliminated (TTO)

**Success criteria**:
- 2-3 pilot services onboarded with skills
- ≥50% reduction in manual declarations for those services
- All skill invocations logged

#### V2 — Critical Lists & Guardrails
**Customer gets**: Critical customer list skill, guardrail skill, improved registration UX

**Problems solved**: Custom escalation rules, regional guardrails

**Success criteria**:
- 5+ services with active skills
- Increased coverage & reduced TTM services using critical S500 list skills
- Self-service skill registration for supported skill types (no eng support needed)

#### V3+ — Expanded Skill Types & Platform Intelligence
**Customer gets**: Impact query skills, custom escalation rules, intrinsic Brain skills (e.g., Geneva monitor integration skill, custom canvas skill)

**Problems solved**: Custom impact assessment, advanced escalation logic, platform extensibility

**Success criteria**:
- Skills framework supports 3rd-party/agentic integrations
- Brain-native skills for common patterns

---

## 6) Dependencies, Integrations & Rollout

### Brain Experience & E2E Considerations
- **Configuration**: Skills defined at a service level (V1) or in an intelligent monitor configuration (same place users configure detections). Default = no skill (use Brain's paved path). Users opt-in.
- **Incident experience**: When a skill is invoked, IcM incident notes which skill was used and the evaluation result for transparency.
- **Brain Investigate**: Show skill invocation history for debugging/audit.

### Ecosystem Integration/Dependencies

| Brain Team | Anticipated Work |
|------------|------------------|
| **AI Monitoring-Pipeline** | Build skill registry in monitor config, skill schema/validation, versioning |
| **AI Monitoring-Actions** | Invoke skills during detection evaluation, pass context to skill, consume result |
| **AI Platform** | Skill execution runtime (if skills include KQL or external calls) |
| **AI Experiences** | Incident experience updates, future skill management UI |
| **AI Models** | None for V1 (skills are rule-based) |
| **Auto-Diagnosis** | None for V1 |

| External Partner | Integration |
|------------------|-------------|
| **Geneva Monitors** | Skills consume Geneva monitor detections as input |
| **IcM** | Skill evaluation results attached to incidents |
| **Kusto/ADX** | Impact query skills execute KQL |

### Rollout, Change Management & Customer Comms
- **Preview cohort**: 2-3 services with high Geneva monitor manual outage declaration volume (candidates: [TBD])
- **Feature flag**: `brain-skills-enabled` at service level
- **Rollback criteria**: If skill causes >10% increase in false positive outage declarations, disable and revert
- **Comms**: Announce in Brain newsletter, 1:1 onboarding with pilot services

### Ownership

| Phase | Driver | Accountable | Consulted | Informed |
|-------|--------|-------------|-----------|----------|
| V1 Design | PM (Matthew) | AI Monitoring-Pipeline Lead | Actions, Platform | Experiences |
| V1 Build | Pipeline Eng | Pipeline Lead | Actions Eng | PM |
| V1 Pilot | PM | Pipeline Lead | Pilot Services | Leadership |
| V2+ | PM | Pipeline + Actions Leads | All Brain teams | Leadership |

---

## 7) Risks, Alternatives & Open Questions

### Key Decisions

| Decision | Options Considered | Rationale | Date | Owner |
|----------|-------------------|-----------|------|-------|
| Start with Geneva monitor outage assessment | (a) Start with critical lists, (b) Start with guardrails, (c) Start with outage assessment | Outage assessment solves biggest pain point (~15% manual declarations) and aligns with contracts-first strategy | 2026-01 | PM |
| Store skills in monitor config | (a) Separate skills service, (b) Embed in monitor config | Monitor config is where users already define detection behavior; reduces friction | 2026-01 | Pipeline |
| YAML-first, no UI in V1 | (a) Build UI, (b) YAML-only | Faster to ship; UI can come in V2 based on learnings | 2026-01 | PM |

### Top Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Skills logic is too complex for users to define | Medium | High | Provide templates and examples; start with simple rule-based skills |
| Skill bugs cause false outage declarations | Medium | High | Require validation on registration; shadow mode before live |
| Adoption is slow | Low | Medium | Partner closely with pilot services; show clear value in metrics |

### Alternatives Considered
- **Full workflow engine**: Too complex for V1; skills are deliberately constrained to specific types
- **Hard-coded per-service logic**: Current state; doesn't scale and isn't auditable
- **Rely solely on model improvements**: Doesn't address service-specific knowledge that models can't learn

### Open Questions
- Q1: What is the exact skill schema (YAML structure) for outage assessment? → To be defined with pilot services
- Q2: How do we handle skill execution failures gracefully? → Fallback to manual declaration?
- Q3: Should skills support OR/AND logic or just sequential evaluation?

---

## Appendix

### Definitions

| Term | Definition |
|------|------------|
| **Brain Skill** | A modular, contract-driven extension that a service provides to Brain to add service-specific logic |
| **Skill Registry** | Central storage for all registered skills, supporting versioning and discoverability |
| **Paved Path** | Brain's default, automated decision-making without service-specific customization |
| **Geneva Monitor** | Azure's built-in monitoring system; can detect issues but relies on thresholds |
| **Outage Assessment** | The process of determining whether a detection represents a real customer-impacting outage |
| **S500** | Top 500 strategic Azure subscriptions requiring special handling |
| **SIA Criteria** | Service Impact Assessment criteria used to classify outage severity |
| **Contract** | Documented, versioned interface definition for skills (inputs, outputs, behavior) |

### File Structure Diagram [WIP]

```
brain-skills/
├── README.md                    # Overview and getting started
├── schema/
│   ├── skill.schema.json        # JSON Schema for skill validation
│   └── examples/
│       ├── outage-assessment.yaml
│       ├── critical-list.yaml
│       └── guardrail.yaml
├── registry/
│   ├── index.ts                 # Skill registry service
│   ├── validator.ts             # Schema validation
│   └── versioning.ts            # Version management
├── runtime/
│   ├── executor.ts              # Skill execution engine
│   ├── context.ts               # Context passed to skills
│   └── adapters/
│       ├── kql-adapter.ts       # Execute KQL queries
│       └── rule-adapter.ts      # Evaluate rule-based skills
├── skills/
│   ├── outage-assessment/
│   │   ├── types.ts             # Skill-specific types
│   │   ├── evaluator.ts         # Assessment logic
│   │   └── tests/
│   ├── critical-list/
│   │   ├── types.ts
│   │   └── matcher.ts           # Subscription matching
│   └── guardrail/
│       ├── types.ts
│       └── enforcer.ts          # Guardrail check logic
├── integration/
│   ├── detection-hook.ts        # Hook into detection pipeline
│   ├── icm-enrichment.ts        # Add skill info to incidents
│   └── telemetry.ts             # Logging and audit
└── config/
    └── feature-flags.ts         # Feature flag management
```

### Example: Outage Assessment Skill (YAML)

```yaml
# Skill definition for Geneva monitor outage assessment
apiVersion: brain.azure.com/v1
kind: OutageAssessmentSkill
metadata:
  name: xstore-blob-monitor-assessment
  version: 1.0.0
  service: XStore
  owner: xstore-oncall@microsoft.com
spec:
  # Which monitors this skill applies to
  monitors:
    - monitorId: "geneva-monitor-123abc"
    - monitorId: "geneva-monitor-456def"
  
  # Assessment workflow
  assessment:
    # Step 1: Check if impact exceeds threshold
    - name: check-impact-threshold
      type: rule
      condition: "detection.impactedSubscriptions >= 10"
      onFail: skip  # Not enough impact, don't declare
    
    # Step 2: Verify not in canary region
    - name: check-not-canary
      type: guardrail
      condition: "detection.region NOT IN ['canary-east', 'canary-west']"
      onFail: skip  # Canary region, don't declare
    
    # Step 3: Run custom KQL for true impact
    - name: verify-customer-impact
      type: kql
      query: |
        XStoreMetrics
        | where TimeGenerated > ago(15m)
        | where MonitorId == "{{detection.monitorId}}"
        | summarize FailedRequests = sum(FailedCount) by SubscriptionId
        | where FailedRequests > 100
        | count
      threshold: "> 0"
      onFail: skip  # No real customer impact
  
  # If all steps pass, declare outage
  onSuccess:
    action: declare-outage
    severity: auto  # Let Brain determine based on impact
    notes: "Auto-declared via XStore outage assessment skill"
```

### Parallels to Industry

| Claude or Codex Skills (AI Assistant) | Brain Skills (Incident Intelligence) |
|------------------------------|--------------------------------------|
| User adds a "skill" (e.g., UI builder) | Service adds a "skill" (e.g., outage assessment) |
| Invoked automatically when context matches | Invoked automatically when detection context matches |
| Governed by contracts (inputs/outputs) | Governed by contracts (inputs/outputs, versioning) |

### Related Documents [Matt to attach]
- [Hrishi's Contracts-First Proposal] — Strategic alignment on contract-driven extensibility
- [Geneva Monitor Integration Roadmap] — Plans for deeper Geneva monitor support in Brain
- [Brain Detection Pipeline Architecture] — Where skills hook into the detection flow
