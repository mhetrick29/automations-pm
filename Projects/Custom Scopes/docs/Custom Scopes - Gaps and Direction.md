# Custom Scopes: Gaps and Direction

## Summary: The Core Problem We Are Solving

Custom Scopes launched at the end of 2025. Services can now declare outages at any scope they choose — scale unit, SI, custom dimension — rather than being locked to region. This was a real unlock: better coverage, change management at the right granularity, and the removal of years of nonstandard-location workarounds that burdened both Brain and service teams.

But the launch left structural gaps. Today, customers are confused about what scope options they can even set, pass-through information across scopes is unimplemented, services can only configure one scope per SLI with no independent outage criteria, only the EB model works at custom scopes (blocking health-based modeling, latency detection, and OPM), health visualization doesn't extend to custom scopes, and non-Azure authority locations (AFD edge sites) are held together by a fragile workaround. Most of the toil to configure and maintain custom scope setups still falls on the Brain team — and services that want multi-scope behavior, latency detection, or proper live site coverage are blocked.

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

**Bottom line:** H2 makes custom scopes more complete for the scenarios we originally targeted. But six structural gaps remain that block us from calling custom scopes fully supported — and that drive ongoing engineering toil on Brain's side.

---

## Gaps That Still Exist After H2

### 1. Customers don't know what scope options they can set — and are getting surprised by the behavior

Custom scopes are live, but there's no clear product documentation explaining what options a service actually has. Customers don't understand the difference between:

- **Single-dimension scopes** (just region OR just SI) — Brain detects at one dimension at a time
- **Combined scopes** (region + SI together) — Brain detects at the intersection of both dimensions

The ARM team hit this when discussing how to enable custom scopes: they expected detection at region level after enabling SI scope, but would instead get detection at a combined region + SI level — a behavior change they didn't anticipate. Boris Y has noted that multiple other services have run into the same confusion; specific examples to add: **[FILL IN: Boris Y examples]**.

This is a documentation and clarity gap, not a product gap — the behavior is correct, but customers have no way to know what to expect when they configure a scope.

### 2. Pass-through is unimplemented — services need to detect at one scope but surface context from another

Pass-through is a distinct scenario from scope selection: a service wants Brain to detect and declare outages at one scope (e.g., scale unit), but include dimensional context from a different scope (e.g., region) in the incident. This was in the original spec but was deprioritized in Phase 1.

We're now seeing this pattern repeatedly across services. Without pass-through:

- Services that want granular detection (scale unit) but standard incident context (region) are stuck — they have to choose one or the other
- The incident experience for custom-scope outages is missing the context DRIs need to triage quickly

This requires product and detection pipeline work to implement — it's not a docs fix.

### 3. Services can only configure one scope per SLI — with no independent outage criteria per scope

Today, a single SLI is locked to a single detection scope. If a service wants detection at two scopes (e.g., region and a custom dimension), the only option is to use different models for each: EB for the custom scope, DT for region. This is a hacky workaround, not a product capability. And it breaks down immediately when:

- A service wants **more than one non-location custom scope** — there's no second model to fall back to
- A service wants **different outage criteria per scope** — e.g., stricter thresholds at scale unit level than at region level — which is not possible when each scope is locked to a model with a single config

Services hitting this today include AFD, ARM, Service Bus, and OpenAI — all of which need detection at a non-regional scope alongside or instead of region. This is a byproduct of custom scopes only being supported via EB, but it requires explicit product and config work to unlock even after model support expands.

### 4. Custom scopes lack full model coverage and health support

If a customer wants detection at any scope other than region, they are forced onto EB today. EB is not a health-based model, which means health-based modeling — and everything that depends on it — doesn't work at custom scopes. Concretely:

- Brain team absorbs the engineering toil to configure and maintain each EB-based custom scope setup
- Customers are confused about which model they're on and why their behavior differs from region-level detection
- **Latency SLI detection at custom scopes is not possible** — latency detection requires health-based models, which don't operate beyond region
- **No health visualization at custom scopes** — Brain Cloud Health and health context in live site don't extend to custom scopes, leaving DRIs without health context during custom-scope outages
- **No OPM coverage for custom-scoped services** — a direct dependency for the Intelligent Monitors GA goal (Rb H2, Q2)

### 5. No multi-scope hierarchical SLI support

A single SLI can represent only one scope today. Services that want Brain to understand a health hierarchy — region → SI → stamp, for example — must emit separate SLIs for each level. This creates real problems:

- **MDM**: Brain can't understand health across multiple stamps from a single SLI. MDM must emit per-stamp SLIs and manage the sprawl
- **BIC and similar services**: Want to visualize health across 10 app names × 2 traffic types × 3 service types. Separate SLIs for each combination is not feasible (60 SLIs in BIC's case)
- Even if Brain eventually supports health hierarchy visualization during live site, it won't be deliverable from existing signals — customers would still need to restructure their SLI setup

Without multi-scope hierarchical SLIs, Brain can't roll up health across scope levels, correlate related issues within a service's hierarchy, or deliver the health hierarchy experience customers expect.

### 6. Non-Azure authority locations aren't first-class (AFD / Edge Sites)

AFD edge sites require a manual workaround today: AFD emits two separate SLIs (one at edge site scope, one at AFD region scope) with manually specified nonstandard LIDs. The workaround was defined in the Edge Sites one-pager but was never intended as a permanent solution. The consequences are ongoing:

- Brain team and AFD team maintain custom configuration as AFD's edge footprint grows and changes
- Auto-comms at the right metro/edge granularity requires additional custom template work
- No path to correlation across edges within a region without further custom logic
- The workaround doesn't generalize — other services with non-Azure authority locations (similar to AFD) would need the same manual treatment

---

## Pillars We Are Proposing

### Pillar 1: Document what scope options customers actually have

Today, the scope options — single-dimension, combined, hierarchical — are not documented in any customer-facing material. Services are discovering behavior they didn't expect because they have no reference point. This is a documentation update, not a product change.

**Direction:** Publish clear documentation explaining every scope type Brain supports, what each means for detection behavior, and examples for common service patterns (scale unit, SI, custom dimensions).

**What this unlocks:**

- ARM-class confusion stops — services configure scopes knowing exactly what to expect
- Reduces Brain-team support load for scope configuration questions
- Creates the foundation customers need before they can meaningfully use multi-scope capabilities

### Pillar 2: Multiple scopes per SLI with independent outage criteria

Today, a single SLI is locked to a single detection scope and a single model config. Services like AFD, ARM, Service Bus, and OpenAI — all of which need detection at non-regional scopes — are blocked or using hacky model workarounds. This is the highest-volume gap we're seeing across teams.

**Direction:** Allow services to configure multiple scopes per SLI — each with its own detection logic and outage criteria — as a first-class product capability.

**What this unlocks:**

- Services can define stricter thresholds at scale unit level than at region level from the same SLI
- Multiple non-location custom scopes supported without model workarounds
- The hacky DT-for-region + EB-for-custom-scope pattern is replaced by a single, configurable SLI
- AFD, ARM, Service Bus, OpenAI, and others unblocked without custom Brain-team involvement

### Pillar 3: Full model coverage and health support at custom scopes

Today, custom scopes are EB-only, and health-based modeling doesn't reach beyond region. Expanding model coverage is the key unlock for Brain's coverage goals, the latency SLI gap, and the Intelligent Monitors GA milestone.

**Direction:** Lift the model restriction so any service using custom scopes benefits from Brain's full detection portfolio — without Brain-team involvement to configure it.

**What this unlocks:**

- Health-based models at custom scopes → latency SLI detection unblocked, Brain Cloud Health extended to custom scopes, DRIs get health context during live site
- OPM at custom scopes → Intelligent Monitors can support custom scopes (direct dependency for IM Goal 4, Rb H2)
- Brain's engineering toil per custom-scope setup drops as EB-specific manual work is replaced by self-service model selection

### Pillar 4: Pass-through — detect at one scope, surface context from another

Pass-through is a distinct product capability from scope selection: a service wants Brain to detect and declare outages at one scope, but include dimensional context from a different scope in the incident. This was in the original spec, deprioritized in Phase 1, and is now showing up repeatedly as services try to enable granular detection.

**Direction:** Implement pass-through as a first-class detection pipeline capability, so services can configure scope A for detection and scope B for incident context independently.

**What this unlocks:**

- Services that need granular detection (scale unit) with standard incident context (region) are no longer forced to choose one or the other
- DRIs responding to custom-scope outages get full context — scope of detection and broader scope context — in a single incident
- Unblocks the next class of services that were waiting on this before enabling custom scopes

### Pillar 5: First-class non-Azure authority location support (Edge Sites)

Today, AFD's edge sites are a custom workaround. The workaround doesn't scale and creates ongoing maintenance burden on both teams.

**Direction:** Define a first-class LID standard for edge sites and extend Brain's data model, detection pipeline, and auto-comms to support non-Azure authority locations natively.

**What this unlocks:**

- AFD migrates from the workaround to the standard schema with no ongoing manual configuration
- Auto-comms at metro/edge granularity works without custom templates
- Correlation across edges within a region becomes a product feature, not custom logic
- Other services with similar location models have a path forward without Brain-team workarounds

### Pillar 6: Multi-scope hierarchical SLIs

Today, a single SLI can only carry one scope. Services needing a health hierarchy must emit multiple SLIs, multiplying their cost and Brain's processing overhead.

**Direction:** Allow a single SLI to define multiple hierarchical scopes, so Brain can roll up health, correlate issues across scope levels, and visualize a full service health hierarchy from the same signal.

**What this unlocks:**

- MDM can emit one SLI and Brain understands health across all stamps
- BIC can represent app × traffic × service type hierarchy without 60 SLIs
- Foundational for the live site health hierarchy visualization experience
- Correlation across scope levels within the same service becomes tractable

---

## A Coherent "Next Several Months" Arc

### Phase 1 — H2 completions + scope documentation (Pillar 1)

- Correlation and auto-comms for custom scopes (in-flight)
- Simpler enablement and configuration of custom scopes (in-flight)
- Publish scope documentation: single / combined / hierarchical options, behavior explanations, examples for common service patterns

### Phase 2 — Multiple scopes per SLI + full model coverage (Pillars 2–3)

- Multiple scopes per SLI with independent outage criteria per scope (AFD, ARM, Service Bus, OpenAI unblocked)
- Health-based models at custom scopes → latency SLI unblocked, Brain Cloud Health extended
- OPM at custom scopes → IM GA custom scopes goal unlocked (Rb H2)
- Brain engineering toil per custom-scope service drops to near zero

### Phase 3 — Pass-through + Edge Sites + Hierarchical SLIs (Pillars 4–6)

- Pass-through: detect at scope A, surface context from scope B in the incident
- Edge Site LID schema first-class support; AFD migration from workaround to standard schema
- Multi-scope hierarchical SLI support (MDM, BIC scenarios)
- Health rollup and correlation across scope levels from a single signal

---

## Metrics That Will Move

### Near-term (H2 completions + Phase 1)

- Brain team engineering hours per new custom-scope onboarding (↓ as scope model is self-service and documented)
- Services waiting on pass-through to unblock their scope configuration (↓ to zero)

### Post-gap (Phases 2–3)

| Outcome | Metric | What Moves It |
|---|---|---|
| High-demand services unblocked | Services using 2+ scopes per SLI natively (AFD, ARM, Service Bus, OpenAI) | Pillar 2 |
| Coverage expansion | Services with latency SLI detection at custom scopes | Health-based model support (Pillar 3) |
| IM GA dependency cleared | OPM at custom scopes shipped | Pillar 3 model expansion |
| Pass-through services unblocked | Services waiting on detect-at-A / surface-B pattern | Pillar 4 |
| AFD toil eliminated | Manual Brain-team hours for AFD scope maintenance | Edge Site first-class support (Pillar 5) |
| Coverage improvement | AFD Brain coverage (31% today) | Edge Site schema GA (Pillar 5) |
| Reduced SLI sprawl | Avg. SLIs per service using custom scopes | Multi-scope hierarchical SLIs (Pillar 6) |
