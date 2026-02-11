
# Unified Spec Template
This is a Unified Spec Template, a standardized, Markdown‑based structure for writing high‑quality Brain specs. It captures the recurring strengths of our best specifications while embedding reviewer‑focused guidance to prevent common pitfalls.
Use this template when drafting any new Brain epic, feature spec, or design document. There are instructions for how to formulate each section.

## Title
The title of the spec

## Version & People
- **Status**: Draft | Review | Approved
- **Author(s)**: 
- **Approvers/Stakeholders**: 
- **DACI/RACI**: 
- **Links**: ADO item(s), designs, prototypes, link to the definitions in the appendix
---

## 1) Executive Summary (One Page)
This should be a paragraph summarizing the following content:
- Problem in one paragraph (external, customer-first).
- What we are proposing (scope & value).
- Expected outcomes (top 2–3 business/customer/tech results).
- The ask (funding/teams/timeline).
- TL;DR (one-liner): what changes for customers and why it matters now.

## 2) Users & Scenarios
Key user personas and scenarios. Define the personas, primary and secondary, and then describe the scenarios/workflows in which users encounter the problems. Typically the primary users will be customers and the secondary users will be internal (Brain). There can be various types of customers though, so categorize appropriately.

## 3) Problems
List the different problems users have with accomplishing the workflows/scenarios. Be sure to tie the problems to scenarios.

### 2.1 External (customer/DRI) pain
Current pain of customers, evidence of the pain (messages, data, incidents, etc.), and why it matters now.

### 2.2 Internal (Brain/ops) pain
What is our internal pain? How much effort are we putting out? Describe in terms of scale, support load, operational risk, cost drivers.


## 4) Metrics, Goals & Non‑Goals
### Goals (P0/P1)
High level goals. Format as a table with the goal, the target metric, and the priority (P0/P1, or P2)
The goal should be describing what the customer wants, not how they will get it; this shoudn't be a list of features.

### Non‑Goals (to prevent scope creep)
Define the things we will not do as part of this in a list.

### Success Metrics (SMART)
Include a table of the metrics we will measure to ensure success of this proposal. It should clearly align to the problems and the goals. 
- **Business**: e.g., reduced support load; cost efficiency
- **Customer**: e.g., coverage ↑, TTN ↓, user satisfaction ↑
- **Tech**: e.g., precision/recall, false positive rate, TTO/TTM improvements

Table format: **Metric | Baseline | Target | By (date) | Source/Query | Owner**

## 6) Proposed Solution (WHAT → minimal HOW)
### Overview
High level summary of what we are proposing

### Capabilities (customer‑facing)
These are the capabilities we want the customers to be able to have and the specific ways we intend those customers to use the capabiities. The capabilities should be a list with a description of what it is and how a customer will use it. Each capability should have a priority. Sort by priority (P0, P1, P2). Ex:
- Capability 1:
- Capability 2 …

### Phased Approach to the solution
Describe how we should roll this out by essentailly listing the capabilities that should be delivered in each phase- based on the problems, what are the most important things to go in the first release? What about a second release, third release, etc..? 
For each phase, give:
- A 2-3 sentence summary of the release that gives a crisp overview of what is getting released.
- What customers get in the release
- What problems should be solved in that phase (don't just list, give a description for how this phase solves the problems)
- Also give the specific ways we will measure the experience in each phase relative to our success metrics
- **V1 (MVP):** typically the thing that solves the biggest problem(s)
- **V2:** expansions to other key capabilities or things that were P1 for V1
- **V3+:** future areas of exploration and known gaps we could look at, such as expanding intelligence, more peripheral capability support, etc.

## 7) Dependencies, Integrations, and potential rollout
### Brain Experience & E2E Considerations
Describe any intended experience changes and changes to UX. 
- How should users think about configuration (i.e. what is the default behavior & what can be adjusted)? 
- What is the incident/outage experience in IcM and Brain investigate?
- What experience are we thinking of across all Brain capabilities (Detection, Triage, Diagnosis, Comms, Health/BCH, Recovery Dashboard, Deployment Checks, etc.)?
- Any natural‑language or preview/what‑if interactions?

### Ecosystem Integration/Dependencies
Describe any anticipated work from partner teams both internal and external:
- What internal work (at a high level) is needed or anticipated across the 6 Brain teams (AI Models, AI Platform, AI monitoring-pipeline, AI monitoring-actions, Auto-Diagnosis, and AI experiences)? For example, intelligent monitors needs work from the model team (for creating new models), the platform team (to orchestrate the detections), the pipeline team (to enabel configuration), the actions team (to ensure correct impact), and the experiences team (to build the UI experience and the incident experience). 
- How will this interact with external partners (SLO/SLI Platform, ARG, IcM, etc.) 
- Contracts & data exchanged (at the level of *what*, not protobufs).

### Rollout, Change Management & Customer release Comms
- Preview/beta cohorts; gating and feature flags; success/fail rollback criteria
- List any considerations about things that we might need to update or migrate with careful consideration.

### Ownership
- RACI across phases (who drives what; who is accountable)


## 8) Risks, Alternatives & Open Questions
This section is mainly about the decisions we made during the spec writing process, the risks we may encounter, any alternatives considered in the solution and why we didnt go with that, and any existing open questions.
- **Key decisions:** (Decision / Option considered / Rationale / Date / Owner)
- **Top risks** (likelihood × impact) and mitigations
- **Alternatives considered** (and why we did not choose them)
- **Open Questions**List any open questions we still may have.
    - Q1 …
    - Q2 …

## Appendix (Design/Implementation Details)
Any ideas about how to implement things (the how), any detailed descriptions, definitions, conceptual models, etc. go in here. Always incude a definitions list. Definitions should include Canonical definitions for terms (e.g., Scope, SI, Region, Zone, Customer‑centric vs Service‑centric SLI, “deterministic” vs “indeterministic”, etc.) and/or a ;ink to standards (Location ID, ARG, SLO/SLI authoring) when applicable.
Other things that can go in here:
- Detailed UX flows, Figma links, information architecture
- Backend design notes, schemas, APIs, error handling, limits
