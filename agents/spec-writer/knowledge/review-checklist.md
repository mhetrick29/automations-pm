# Spec Review Checklist

Use this checklist after drafting a spec to catch common issues. Auto-generate a filled version at the end of every spec.

## Structure & Metadata
- [ ] Version & People section is complete (Status, Authors, Approvers, DACI, Links)
- [ ] Executive Summary fits on one page and has a clear TL;DR

## Users & Problems
- [ ] Personas are defined (primary = customers, secondary = internal/Brain)
- [ ] Problems are tied to specific scenarios with evidence (messages, data, incidents)

## Goals & Metrics
- [ ] Every P0/P1 goal maps to a success metric in the metrics table
- [ ] Goals describe outcomes, not features
- [ ] Non-goals explicitly prevent scope creep

## Solution & Capabilities
- [ ] Capabilities have a priority (P0/P1/P2) and describe customer usage
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

## Appendix & Consistency
- [ ] Appendix has definitions list with canonical terms
- [ ] Consistent terminology throughout (scope, SI, zone, etc.)
