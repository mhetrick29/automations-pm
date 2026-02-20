Brain Priorities – February 2026

Authors & contributors: Jeff Davis, Rey Gereda, Jian Zhang + AIOps Eng/PMs

# Proposed Priorities

The document Brain AIOps: Our Purpose and Path Forward, published in December, 2025, outlines our overall strategy and vision.

As we pursue this vision, our prioritized investment areas for the next semester (April – September, 2026) can be summarized as:

Fundamentals: Security & #Quality – Brain is a critical service available in all clouds

Brain for SHIM: Deliver capabilities and experiences needed to improve Azure service health

Brain for Change and Resiliency: Covered in a separate planning document.

Brain Scale / Product Experiences: Make it easier for more Microsoft services to take advantage of Brain capabilities and reduce TTM

AI Innovation: Deliver AI Innovation to enhance Service Health & build self-healing system

We continue to be focused on increasing Brain coverage, reducing TTx, and ensuring Brain can scale to support more Microsoft services. Next semester we will dedicate effort to ensure that we finish several pilot features started during Krypton and reach general availability to improve Brain scale and service team experience. Our SHIM efforts will focus on reaching our top-level Bowler KPI targets – 85% Brain Coverage, 35 min TTO, and 40 min TTN. In addition to feature work, we will continue to drive the Service Health program, partnering with the Service Health SRE team to on-board new SLIs and service monitors, improve Triage and auto-linking coverage, drive Service Health parity across clouds, and enable Autocomms for SLIs and service monitors. The following sections will describe the targeted improvements planned for each investment area.

## Fundamentals (Owner: Rey Gereda)

### Security and Quality

AIOps services are working on reducing the Service OoSLA Security Debt reported at https://aka.ma/aiopsGetSecure and get them to yellow (score < 100) in [Kr]. Post [Kr] we’ll work on staying green around KPIs related to compliance and keep the OoSLA Security debt under 100.

Address any items left from SFI Wave 8 and any work left from previous SFI Waves.

SFI Waves 9 and 10 work.

Complete Risk Thread Modeling (RTM) refresh for all AIOps services (Due every 6 months) and Risks in RQ1 are understood and mitigation for them is planned (no identify-new).

Brain E2E validation using testing in in Shadow Mode and testing with Failure Simulation Signals (FSS).

Continue Health Platform initiatives related to scale outs, buildouts, and hardening infrastructure.

### Non-Public Cloud Support

We will continue to add support for Brain in non-public clouds, expanding from the current support in Fairfax, AGC, and partial support in Bleu. Next semester we will complete deployment for all in-scope services on Bleu and Mooncake and begin the Delos buildout.

### DRI toil reduction

Today, Brain team members spend significant time supporting customers and running the services. Next semester we will expand our use of AI agents to respond to CRIs and Sev3 incidents with a goal of reducing DRI toil in the AIOps teams by 50% as measured using DRI surveys.

## Brain for SHIM (Owner: Jeff Davis)

### AI Automated Incident Review for Service Monitors - Pilot

Over the past 6 months, 15% of QCS outages were declared by service monitors not integrated with Brain. The reason that many of the service monitors are not integrated with Brain is that they are noisy, requiring manual incident review before an outage can be confidently declared. We will explore using AI agents to automatically review incidents for service monitors that are not integrated with Brain to filter noise and declare outages when appropriate, both reducing DRI toil and accelerating service monitor integration with Brain.

### S500 and High-Priority Customer resource Detection - Pilot

The current Critical Resources pilot enables Brain to declare outages when it detects issues with a list of critical resources specified by service teams. Next semester we will expand this pilot to ensure service teams can manage these critical resource lists (currently the resource lists can only be managed by the Brain team) and provide an easy way for service teams to indicate that Brain should treat all resources for high-priority customers or subscriptions as critical.

### Brain Autocomms respects outage links

During large multi-service outages Incident Managers often disable Brain Autocomms because Brain may not get the list of services involved in the outage exactly right and there is no way to add or remove services from the multi-service outage communication. Next semester we will work with the EngOps team to ensure Brain respects responsible / impacted service links established by Incident Managers and service teams when sending Autocomms, providing an easy way to modify the list of services in a multi-service outage communication.

## Brain Scale / Product Experiences (Owner: Jeff Davis)

### Detection

#### Custom Scopes (LID + custom dimensions) - GA

During Krypton we launched a pilot of Custom Scopes support for Error Budget success rate SLIs. Next semester we will ensure all remaining Brain detection models support Custom Scopes, including Latency and resource health Success Rate models and we make this feature generally available to all services. In addition, we will add support for the Edge Sites Location ID schema, ensuring support for Azure Front Door and other services that deploy code outside Azure data centers.

#### Per Status Code outage detection - GA

During Kr we are delivering Status Code detection to a set of pilot services. The current pilot experience requires service teams to create separate SLIs specifically for Status Code detection, resulting in extra work and processing resources. Our goal next semester is to evolve the Success Rate SLI format in Brain so that all current detection models can work with Success Rate SLIs with status code information. Our goal is to make this feature generally available to all services by the end of next semester.

#### Multiple signals (including Support Requests) - GA

The initial Outage Prediction Model pilot has shown good promise, showing how Brain can utilize multiple signals, including Support Requests, to decide whether an outage is occurring. Next semester we will make this feature available for all services when using Intelligent Monitors (see below), simplifying the setup and configuration process and ensuring services get high-quality detection results.

### Automatically communicate to tenants through M365 Admin Portal – GA

Our goal for this semester is to deliver pilot AutoComms support for communicating to tenants through M365 Admin Portal for Fabric Platform Shared Services. Next semester we will ensure this pilot is working well and make it available as an option for all services.

### Configuration

#### Intelligent Monitors – GA

During Krypton we plan to deliver a pilot of the Brain Intelligent Monitor, moving from today’s experience where service teams must manage separate monitors for each SLI and detection model (i.e. error budget vs. resource health success rate models) to a significantly simplified experience where service teams can define a single Brain monitor for multiple SLIs / signals and no longer need to manage the details of specific detection models. Next semester we will complete this experience, with a goal to only use Intelligent Monitors for new services and migrate all existing Brain monitors to Intelligent Monitors.

#### One-click Brain on-boarding for all service teams

This semester we have enabled members of the Brain team to on-board a new service with a single click. Next semester we will make this experience available to service teams themselves, enabling a one-click on-boarding experience with clear status provided during the on-boarding process.

#### Change lifecycle (including preview / testing) for SLIs and Brain monitors

Today it is difficult for service teams to know what results they will get when they change a SLI or Brain monitor configuration. Service teams must choose between making changes in-place, with the potential that they accidentally break existing functionality and incur Brain blackouts due to model retraining, or create new SLIs and monitors to test changes and consume additional resources. For some large services there is a risk that duplicating a large SLI to safely test a change could exceed the capacity in SLI and Brain stamps. Next semester our goal is to deliver a change lifecycle for SLIs and Brain monitors, allowing services to safely and confidently make changes without risking either disruption to Brain functionality or service capacity.

### Live Site Experience

#### Multi-Service Incident Recovery Experience - GA

This quarter we are delivering a new dashboard to help Azure Incident Managers and Executive Incident Managers easily track recovery during a multi-service incident / outage, with an initial focus on tracking recovery for Brain detected SLI incidents / outages. Next semester we will work with the OneFleet team to add recovery experiences for incidents / outages detected by Geneva monitors and key QCS infra services. We will make it easy for service teams to view SLI data to confirm recovery even for outages not detected using SLIs. Brain will use machine learning and AI to interpret and predict service recovery status. We will also work with the IcM team to make this recovery experience easily accessible from the IcM Outage dashboard and drive awareness and adoption across QCS.

#### Brain Live Site Experience - GA

Service team DRIs have reacted positively to the initial Brain Investigate pilot dashboard delivered this semester, noting increased clarity and confidence in Brain data during outages. Our focus for next semester will be to add support for all Brain Aware incidents, ensuring this new Brain Live Site experience is available for all Brain detection models and integrated service monitors. In parallel, we will partner with the Brain Diagnosis team to include root case / diagnostic insights and deliver an end-to-end, unified Brain insights and evidence experience for live-site incidents, complemented by an integrated agentic chat for deeper exploration when needed.

#### Brain insights available in IcM Assistant and bridge

This semester we are delivering a basic first pilot integration of IcM Assistant chat experience with AskBrain. Next semester we want to expand this pilot to include all key Brain insights and add new proactive insights on the Teams bridge to help drive clarity and efficiency during outages. In addition, we will partner with the IcM team to light up a great Brain experience on the IcM landing page and in their new Teams bridge dashboard design.

## Drive innovation in AI (Owner: Jian Zhang)

### Log Intelligence - anomaly detection (AD)

The Log Intelligence – AD project is a MAIDAP–Azure Core collaboration to build a log‑based anomaly detection system for Quality Critical Services (QCS), starting with Fabric Platform Shared Service (FPSS). It develops: 1) A prototype anomaly detection model using unstructured log data and telemetry. 2) Scalable pipelines for log processing and model evaluation. 3) An exploratory data analysis (EDA) report and proposed architecture for data + model scaling. 4) Application of the model to FPSS as the priority use case.

Log‑based anomaly detection enables broader, earlier, and more scalable outage detection—critical for improving Azure reliability and strengthening Brain’s detection capabilities.

### BACK TESTING AGENT

Manual back‑testing and promotion steps slowed onboarding, created bottlenecks for service teams, and limited coverage improvements. By building automated scheduling, dashboards, parameter tuning, GitOps integration, natural‑language agent workflows, and replay‑based validation pipelines, the effort aims to streamline end‑to‑end AOD promotion, reduce demotions, enable more consistent and evidence‑driven parameter updates, and ultimately increase BRAIN’s outage detection quality and coverage in a scalable, service‑friendly way. The evolution of BRAIN’s back‑testing and AOD (Autonomous Outage Detection) promotion pipeline proposed enable the team to shift from a historically manual, FTE‑driven process to an increasingly automated, agent‑assisted system to accelerate signal promotion, improve precision/recall, expand service coverage, and reduce operational burden.

### Suggest SLIs during Development

This is a shift‑left initiative designed to help service teams define the right Service Level Indicators (SLIs) early in the build phase, rather than discovering missing signals only after outages occur. Today, Brain often identifies gaps reactively—during incident reviews, tuning cycles, or when detection quality issues surface—delaying readiness and increasing operational burden for teams. By proactively recommending candidate SLIs based on service architecture, metric patterns, and proven reliability categories, this project ensures teams have high‑quality health signals before services reach production scale. The result is faster onboarding to Brain, stronger outage detection from day one, and a more reliable, cost‑efficient development lifecycle.

### New Models for Detection and Triage

The New Models for Detection and Triage project aims to build a next generation reasoning model—developed jointly with the M365 DKI team—that applies LLM-based understanding to free-text signals such as IcM tickets, outage bridge transcripts, and TSGs to improve Brain’s outage detection and triage accuracy. The effort includes two key components: QTriage, which leverages historical tickets and LLM/Reasoning to enable more reliable cross-service triage while reducing today’s extensive rule-maintenance burden; and an outage prediction model that extracts predictive cues from non-SLI discussions in historical tickets. Today, Brain’s detection pipeline depends largely on structured SLIs, which can miss early signals, delay outage declarations, and limit triage precision. By incorporating rich, context-heavy textual signals and adding model-backed confidence scoring, the new reasoning layer will help Brain detect outages earlier, reduce both false positives and false negatives, and improve automatic incident linking. This shift materially strengthens end-to-end outage management by providing deeper situational awareness and enabling faster, more accurate triage from the moment an anomaly appears.-generation reasoning model—developed jointly with the M365 DKI team—that applies LLM-based understanding to free-text signals such as IcM tickets, outage bridge transcripts, and TSGs to improve Brain’s outage detection and triage accuracy. The effort includes two key components: -Triage-to-end outage management by providing deeper situational awareness and enabling faster, more accurate triage from the moment an anomaly appears.

# Work we will Defer / Stop Doing

Defer: Brain can detect on failure count only signals (Storage ask). 
Justification: Prioritizing finishing Status Code and Custom Scopes work. Storage team will need to continue to use service monitors for this.

Defer: Brain can detect significant traffic volume drops (CoreAI, SQL, and Log Analytics ask). 
Justification: Prioritizing finishing Status Code and Custom Scopes work.

Defer: On-board all Resiliency Critical Services (RCS) to Brain. 
Justification: Brain team doesn’t have the resources to support the manual effort needed. We will focus on building a more automated product experience using Intelligent Monitors and One-Click On-Boarding Support to enable this on-boarding to begin in Q4 CY26.

Defer: Analyze and drive Autocomms customer coverage for a given outage
Justification: Prioritizing Autocomms adoption and general availability for M365 Admin Portal support.

Defer: Detailed outage impact for critical partners / customers (SAP, Walmart, etc.)
Justification: Prioritizing S500 and high-priority customer resource outage detection.

Defer: Automatically generate TSG. 
Justification: Brain has the potential to automatically generate a TSG based on current outage data and steps taken during similar outages, but do not have the resources to begin this work.

Defer: View Zone health. 
Justification: Focusing on Recovery and DRI Live Site experiences.

Defer: View health of custom scopes (LID + custom dimensions). 
Justification: Focusing on finishing detection platform capabilities for Custom Scopes.

Defer: Automated Brain support experience using AskBrain
Justification: Prioritizing AskBrain integration with IcM Assistant during live site / bridge.

Defer: Design features / capabilities for non-Azure (i.e. E+D, BIC) services, including additional SaaS-oriented features. 
Justification: Focusing our efforts on Azure service support.

Defer: Unified Brain portal in Jarvis with agent-driven, actionable insights.
Justification: Prioritizing Intelligent Monitor and One-Click On-boarding efforts to improve the Brain on-boarding experience.

Defer: Different thresholds for incident vs. outage for the same Brain monitor.
Justification: Brain current focus and priority is on outage detection.
