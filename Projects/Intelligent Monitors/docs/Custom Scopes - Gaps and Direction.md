# Custom Scopes: Gaps and Direction

## Summary: The Core Problem We Are Solving

Custom Scopes launched at the end of 2025. Services can now declare outages at any scope they choose — scale unit, SI, custom dimension — rather than being locked to region. This was a real unlock: better coverage, change management at the right granularity, and the removal of years of nonstandard-location workarounds that burdened both Brain and service teams.

But the launch left structural gaps. Today, custom scopes support is narrow: the scope model is undefined at the product level, only the EB model works at custom scopes (blocking health-based modeling, latency detection, and OPM), services can only configure one scope per SLI with no way to set independent outage criteria per scope, health visualization doesn't extend to custom scopes, and non-Azure authority locations (AFD edge sites) are held together by a fragile workaround. Most of the toil to configure and maintain custom scope setups still falls on the Brain team — and services that want multi-scope behavior, latency detection, or proper live site coverage are blocked.

Closing these gaps is what transforms custom scopes from a limited pilot into a full-coverage, self-service capability.

---

## Engineering Toil: Current State

> **[FILL IN: eng-hours data here]** — e.g., avg. Brain-team hours to onboard a new custom-scope service, number of services currently requiring manual Brain team involvement to configure custom scopes, estimated hours spent maintaining AFD workaround, etc.

---

## Where We Are and Where We'll Be by End of H2

### What's true today (launched end of 2025)

- Services can declare outages using Brain at any custom scope for their SLI signals
- EB model supports custom scopes (scale unit, SI, custom dimensions)
- Change management scenarios unblocked at custom scope granularity for select services

### What H2 will deliver

- Correlation for custom scopes
- Auto-comms for custom scopes
- Simpler enablement and configuration of custom scopes

**Bottom line:** H2 makes custom scopes more complete for the scenarios we originally targeted. But five structural gaps remain that block us from calling custom scopes fully supported — and that drive ongoing engineering toil on Brain's side.

---

## Gaps That Still Exist After H2

### 1. The scope model is undefined — and services are hitting the edge cases

Services configure one scope per SLI today, but we haven't clearly defined what Brain means by a "scope":

- **Single-dimension scopes** (just region OR just SI) — Brain detects at one dimension at a time
- **Combined scopes** (region + SI together) — Brain detects at the intersection of both dimensions

The ARM team ran into this when we discussed how to enable custom scopes for them — they haven't enabled it yet, but the conversation surfaced that they expected detection at region level after enabling SI scope, but would instead get detection at a combined region + SI level, a behavior change they didn't anticipate. Boris Y has noted that multiple other services have hit the same confusion; specific examples to add: **[FILL IN: Boris Y examples]**.

The original spec included a **pass-through** scenario — detect at scope A, include dimensional context from scope B in the incident — but it was deprioritized in Phase 1. We're seeing this pattern repeatedly across services. It needs to be defined and shipped.

### 2. Custom scopes lack full model coverage and health support

If a customer wants detection at any scope other than region, they are forced onto EB today. EB is not a health-based model, which means health-based modeling — and everything that depends on it — doesn't work at custom scopes. Concretely:

- Brain team absorbs the engineering toil to configure and maintain each EB-based custom scope setup
- Customers are confused about which model they're on and why their behavior differs from region-level detection
- **Latency SLI detection at custom scopes is not possible** — latency detection requires health-based models, which don't operate beyond region
- **No health visualization at custom scopes** — Brain Cloud Health and health context in live site don't extend to custom scopes, leaving DRIs without health context during custom-scope outages
- **No OPM coverage for custom-scoped services** — a direct dependency for the Intelligent Monitors GA goal (Rb H2, Q2)

### 3. Services can only configure one scope per SLI — with no independent outage criteria per scope

Today, a single SLI is locked to a single detection scope. If a service wants detection at two scopes (e.g., region and a custom dimension), the only option is to use different models for each: EB for the custom scope, DT for region. This is a hacky workaround, not a product capability. And it breaks down immediately when:

- A service wants **more than one non-location custom scope** — there's no second model to fall back to
- A service wants **different outage criteria per scope** — e.g., stricter thresholds at scale unit level than at region level — which is not possible when each scope is locked to a model with a single config

This is a byproduct of custom scopes only being supported via EB today. Once model support expands, the ability to configure multiple scopes per SLI with independent detection logic per scope becomes the natural next step — but it requires explicit product and config work to enable.

### 4. No multi-scope hierarchical SLI support

A single SLI can represent only one scope today. Services that want Brain to understand a health hierarchy — region → SI → stamp, for example — must emit separate SLIs for each level. This creates real problems:

- **MDM**: Brain can't understand health across multiple stamps from a single SLI. MDM must emit per-stamp SLIs and manage the sprawl
- **BIC and similar services**: Want to visualize health across 10 app names × 2 traffic types × 3 service types. Separate SLIs for each combination is not feasible (60 SLIs in BIC's case)
- Even if Brain eventually supports health hierarchy visualization during live site, it won't be deliverable from existing signals — customers would still need to restructure their SLI setup

Without multi-scope hierarchical SLIs, Brain can't roll up health across scope levels, correlate related issues within a service's hierarchy, or deliver the health hierarchy experience customers expect.

### 5. Non-Azure authority locations aren't first-class (AFD / Edge Sites)

AFD edge sites require a manual workaround today: AFD emits two separate SLIs (one at edge site scope, one at AFD region scope) with manually specified nonstandard LIDs. The workaround was defined in the Edge Sites one-pager but was never intended as a permanent solution. The consequences are ongoing:

- Brain team and AFD team maintain custom configuration as AFD's edge footprint grows and changes
- Auto-comms at the right metro/edge granularity requires additional custom template work
- No path to correlation across edges within a region without further custom logic
- The workaround doesn't generalize — other services with non-Azure authority locations (similar to AFD) would need the same manual treatment

---

## Pillars We Are Proposing

### Pillar 1: Define the scope model and ship pass-through

Today, the scope model is undefined at the product level. Services are discovering behavior they didn't expect when configuring scopes. Pass-through — detect at one scope, include context from another — is unimplemented despite being in the original spec.

**Direction:** Explicitly define what Brain means by a "scope" in the product. Publish the taxonomy — single, combined, hierarchical — and expose it in documentation and configuration UX. Ship pass-through as a first-class capability.

**What this unlocks:**

- Services configure scopes with predictable, documented behavior — ARM-class confusion stops
- Pass-through unlocks scenarios where services want outage detection at scale unit granularity but need region context surfaced in the incident

### Pillar 2: Full model coverage and health support at custom scopes

Today, custom scopes are EB-only, and health-based modeling doesn't reach beyond region. Expanding model coverage is the single biggest unlock for Brain's coverage goals, the latency SLI gap, and the Intelligent Monitors GA milestone.

**Direction:** Lift the model restriction so any service using custom scopes benefits from Brain's full detection portfolio — without Brain-team involvement to configure it.

**What this unlocks:**

- Health-based models at custom scopes → latency SLI detection unblocked, Brain Cloud Health extended to custom scopes, DRIs get health context during live site
- OPM at custom scopes → Intelligent Monitors can support custom scopes (direct dependency for IM Goal 4, Rb H2)
- Brain's engineering toil per custom-scope setup drops as EB-specific manual work is replaced by self-service model selection

### Pillar 3: Multiple scopes per SLI with independent outage criteria

Today, a single SLI is locked to a single detection scope and a single model configuration. Services must use separate models as a workaround for two scopes, and can't get different outage criteria per scope or support more than one non-location custom scope.

**Direction:** Allow services to configure multiple scopes per SLI — each with its own detection logic and outage criteria — as a first-class product capability.

**What this unlocks:**

- Services can define stricter thresholds at scale unit level than at region level from the same SLI
- Multiple non-location custom scopes supported without model workarounds
- The hacky DT-for-region + EB-for-custom-scope pattern is replaced by a single, configurable SLI

### Pillar 4: Multi-scope hierarchical SLIs

Today, a single SLI can only carry one scope. Services needing a health hierarchy must emit multiple SLIs, multiplying their cost and Brain's processing overhead.

**Direction:** Allow a single SLI to define multiple hierarchical scopes, so Brain can roll up health, correlate issues across scope levels, and visualize a full service health hierarchy from the same signal.

**What this unlocks:**

- MDM can emit one SLI and Brain understands health across all stamps
- BIC can represent app × traffic × service type hierarchy without 60 SLIs
- Foundational for the live site health hierarchy visualization experience
- Correlation across scope levels within the same service becomes tractable

### Pillar 5: First-class non-Azure authority location support (Edge Sites)

Today, AFD's edge sites are a custom workaround. The workaround doesn't scale and creates ongoing maintenance burden on both teams.

**Direction:** Define a first-class LID standard for edge sites and extend Brain's data model, detection pipeline, and auto-comms to support non-Azure authority locations natively.

**What this unlocks:**

- AFD migrates from the workaround to the standard schema with no ongoing manual configuration
- Auto-comms at metro/edge granularity works without custom templates
- Correlation across edges within a region becomes a product feature, not custom logic
- Other services with similar location models have a path forward without Brain-team workarounds

---

## A Coherent "Next Several Months" Arc

### Phase 1 — H2 completions + scope model definition

- Correlation and auto-comms for custom scopes (in-flight)
- Simpler enablement and configuration of custom scopes (in-flight)
- Define and publish the scope taxonomy (single / combined / hierarchical / pass-through)
- Ship pass-through: detect at scope A, include context from scope B

### Phase 2 — Health, OPM, and multiple scopes per SLI

- Health-based models at custom scopes → latency SLI unblocked, Brain Cloud Health extended
- OPM at custom scopes → IM GA custom scopes goal unlocked (Rb H2)
- Multiple scopes per SLI with independent outage criteria per scope
- Brain engineering toil per custom-scope service drops to near zero

### Phase 3 — Hierarchical SLIs + Edge Sites

- Multi-scope hierarchical SLI support (MDM, BIC scenarios)
- Health rollup and correlation across scope levels from a single signal
- Edge Site LID schema first-class support
- AFD migration from workaround to standard schema

---

## Metrics That Will Move

### Near-term (H2 completions + Phase 1)

- Brain team engineering hours per new custom-scope onboarding (↓ as scope model is self-service and documented)
- Services waiting on pass-through to unblock their scope configuration (↓ to zero)

### Post-gap (Phases 2–3)

| Outcome | Metric | What Moves It |
|---|---|---|
| Coverage expansion | Services with latency SLI detection at custom scopes | Health-based model support (Pillar 2) |
| IM GA dependency cleared | OPM at custom scopes shipped | Pillar 2 model expansion |
| Multiple-scope configs without workarounds | Services using 2+ scopes per SLI natively | Pillar 3 |
| Reduced SLI sprawl | Avg. SLIs per service using custom scopes | Multi-scope hierarchical SLIs (Pillar 4) |
| AFD toil eliminated | Manual Brain-team hours for AFD scope maintenance | Edge Site first-class support (Pillar 5) |
| Coverage improvement | AFD Brain coverage (31% today) | Edge Site schema GA |
