Rubidium Priorities

Brain for Change and Resiliency

The document Brain AIOps: Our Purpose and Path Forward, published in December, 2025, outlines our overall strategy and vision. The document Brain Priorities – February 2026 outlines our priorities for Brain for SHIM team. This document is focused on the priorities for the Brain for Change and Resilience team.

Rubidium centers on the following pillars:

Fundamentals: Quality, security, scale, and cloud expansion readiness

Brain for SHIM: Covered in a separate planning document

Brain for Change and Resiliency: Delivering the core health, LID, SI, and scope standards needed across MS services. Advancing Brain’s ability to detect unsafe change and stop bad deployments

Scale / Product Experiences: Make it easier for more Microsoft services to take advantage of Brain and Geneva capabilities and reduce TTM

AI Innovation: Laying foundational work for generative health agents and AIpowered syntheticspowered syntheticspowered syntheticspowered syntheticspowered syntheticspowered synthetics

# Fundamentals

## Non-Public Cloud Support (Owners: Engr Leads)

ADO Epic 36707905

Rubidium Focus Areas

Public & Sovereign Expansions and Hardening: Ensuring data, telemetry, and health workflows operate consistently across sovereign clouds. This includes ensuring the Health Engine, Geneva Health, and core services operate in regionally isolated or regulated infrastructure.

## Quality and Security (Owners: Engr Leads)

ADO Epic 36729333

Rubidium Focus Areas

Quality/Security Baseline: Core S360 commitments, livesite hygiene, and reduction of operational load in system code paths critical to detection, health signal ingestion, and deployment gating.

Outcomes

Reduce the human toil of operating our services by 2X

# Brain for Change and Resiliency

## Unified, Entity Aware Health at Scale (Owners: Scott Kinghorn)

ADO Epic 36707910

Enrich our Health Platform with Azure Resource Graph metadata (zone, ring, scale unit, role), this creates a realtime, multipivot health system that enables service, customer, and deployment centric analysis of health across a common taxonomy.

Rubidium Focus Areas

Health integration ARG: This effort is a two-way integration, where Brain consumes service meta data from ARG and delivers unified health signals into Azure Resource Graph. This enables internal partners to use a single, structured source of truth for service health. This supports the Brain charter goals of integrating health into operational touchpoints wherever developers work.

## Detection & Health (Owners: Scott Kinghorn)

ADO Epic 36729355

Rubidium is an execution semester for scope standardization, enabling consistent health representation across services above and below Azure.

Location ID (LID) Standardization: Define and operationalize the canonical Microsoft cloud LID taxonomy. This is foundational for accurate impact scoping, crossservice reasoning, and downstream diagnostics correlation and enables the entity aware health effort.service reasoning, and downstream diagnostics correlationservice reasoning, and downstream diagnostics correlationservice reasoning, and downstream diagnostics correlationservice reasoning, and downstream diagnostics correlationservice reasoning, and downstream diagnostics correlation

Service Instance (SI) & Custom Scope: Codify the SI and Custom Scope guidance, examples and documentation for service teams and how it relates to use of LID patterns.

## Detection of Service induced changes affecting Health (Owners: Scott Kinghorn, Rakshith Padmanabha)

ADO Epic 36729361

Change remains the largest cause of customer impacting outages; Brain’s mission is to prevent 100% of preventable change related issues before customer impact.

Rubidium is a pivotal semester for deployment stop maturity.

Rubidium Focus Areas

Brain SLI Driven Deployment Stops: We will expand this offering beyond QCS services, update our integration with Change Oracle to leverage our unified Brain Health interface(s), and enable the entity aware health effort.

Wobble Detection for Change: Deliver wobble aware anomaly detection tuned specifically for change driven patterns—not generic outage level anomalies. This addresses the tooling gap called out in the FY27 cut opportunity section: without wobble specific models, precision/recall for change detection will be insufficient.

Leverage Geneva Monitors via Health for Deployment Stops: Expand on our Krypton effort to enable deployment gating based on key Geneva health monitors via our unified Brain Health interface(s), expanding detection coverage for services not yet fully onboarded to Brain SLIs.

Outcomes

Meaningful increase in detection of change driven regressions before customer impact .

Integration of change aware signals into Brain’s multi-signal reasoning

Foundation for closed loop deployment validation required by the Service Health Initiative.

# Scale / Product Experiences

## Scale and Resilience (Owners: Engr Leads)

ADO Epic 36707921

Rubidium Focus Areas

Capacity & Throughput Readiness: Building on the Brain AIOps charter’s mandate that Brain is the “strategy for reliability” across Azure, we will invest in incremental scale improvements for increased SLI volume, partners onboarding, and higher sensitivity detection across workloads.

Scale and Readiness of Geneva systems: Similar work to above will continue to support GHS and related systems in Rubidium.

# AI Innovation

Rubidium will be the semester where the team begins laying the groundwork for agentic and generative reliability capabilities to answer questions related to service health, optimize coverage, reduce toil, and assist in troubleshooting.

## Agentic Health (Owners: Scott Kinghorn)

ADO Epic 36707930

Rubidium Focus Areas

Health AI Agents: Early research and prototyping of agents that can summarize health context, analyze coverage, and provide coverage insights and recommendations. This builds on FY27 investments in AI Innovation.

## Synthetics (Owners: Scott Kinghorn)

ADO Epic 36729389

Rubidium Focus Areas

AI Powered Synthetics: Leverage generative approaches to reduce human involvement in test creation and expand coverage to scenario level synthetics used in change validation, region buildout readiness, and dependency health.

Avail / Canary Validation Tests: Extend synthetics for canary and deployment safety scenarios, aligned with change investments and enabling earlier detection of regressions.

Outcomes

AI Innovation work in Rubidium will remain lightweight—focused on building prototypes, running pilot experiments, and creating the technical foundation for the FY27 investments in AI assisted onboarding, tuning, and analysis.

# Non-Investment Areas

Work we will stop, pause of defer for the coming semester:

Stop: All new development for Azure Monitor health models has stopped.

Stop: Support for existing AHM offering and 4 stamps will not be covered by this team. Stamps to be decommissioned by end of June 2026.

Stop: No new features for Geneva Monitors. 
Mitigation: No critical asks in the pipeline. Team will continue to buildout in new clouds, support and scale service including addressing SFI items. The team will focus on supporting Brain scenarios (e.g., location support) and  Deployment Health. Team will work on moving customers from V1 to V2 monitors.

Defer: Infrastructure and Zonal health will arrive once we have created the foundational system as described in ‘Unified, Entity Aware Health at Scale’ and improved support for more granular scopes.

Defer: No investments to add new capabilities related to Azure Monitor metric alerts.

Defer: Convergence of RHC and Brain service health not in plan for Rubidum.

In addition, the proposed list for consideration is more than the team can handle, but we need to go through the planning exercise before being able to prioritize & sequence specific investments. Essentially, we’ll have more in the risk & tough cuts bucket as we progress.
