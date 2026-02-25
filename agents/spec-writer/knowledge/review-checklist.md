# Spec Review Checklist

Use this checklist after drafting a spec to catch common issues. Auto-generate a filled version at the end of every spec.

## Structure & Metadata
- [ ] Version & People section is complete (Status, Authors, Approvers, DACI, Links)
- [ ] Executive Summary fits on one page and has a clear TL;DR
- [ ] Current state explicitly described — the observable baseline before this work ships
- [ ] Release end state explicitly stated and distinct from the broader multi-release vision — observable difference between current and future state is clear

## Users & Problems
- [ ] Personas are defined (primary = customers, secondary = internal/Brain)
- [ ] Problems are tied to specific scenarios with evidence (messages, data, incidents)
- [ ] Each problem is tagged as existing (customer knows), latent (customer doesn't know yet), or inferred (hypothesis based on data)
- [ ] Confidence level in solving each problem is stated (High / Medium / Low)

## Goals & Metrics
- [ ] Every P0/P1 goal maps to a success metric in the metrics table
- [ ] Goals describe outcomes, not features
- [ ] Goals contain 2–7 items
- [ ] Each goal has a priority (P1 / P2 / P3)
- [ ] Each goal is **SMART**: Specific, Measurable, Achievable, Relevant, Time-bound (explicit date, quarter, or milestone — no date = fail)
- [ ] Each goal explains *why* it is on the list (not assumed to be obvious)
- [ ] Goals link to org/team vision or a stated parent objective
- [ ] Non-goals explicitly prevent scope creep

## Solution & Capabilities
- [ ] Capabilities have a priority (P0/P1/P2) and describe customer usage
- [ ] Every P0/P1 feature maps to a named Customer Problem from the Customer Problems section (by number or explicit reference)
- [ ] Phased approach (V1/V2/V3+) with success criteria per phase

## Dependencies & Rollout
- [ ] Brain team dependencies are called out (Models, Platform, Pipeline, Actions, Diagnosis, Experiences)
- [ ] External dependencies identified (SLO/SLI, ARG, IcM, etc.)
- [ ] Rollout plan includes preview cohorts, feature flags, rollback criteria
- [ ] RACI ownership defined across phases

## Decisions & Risks
- [ ] 3+ key decisions logged with alternatives and rationale
- [ ] Top risks have likelihood x impact and mitigations
- [ ] Open questions are listed
- [ ] Customer validation is cited for key design decisions — survey data, research, pilot results, or an explicit mathematical/logical argument (reviewers should not have to ask "did customers ask for this?")

## Appendix & Consistency
- [ ] Appendix has definitions list with canonical terms
- [ ] Consistent terminology throughout (scope, SI, zone, etc.)
