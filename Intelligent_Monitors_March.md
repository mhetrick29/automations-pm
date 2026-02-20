## Summary: The Core Problems We Are Solving

At a high level, Intelligent Monitors are aimed at eliminating the biggest blockers that prevent services from getting to “add signals → turn on with confidence**->Brain catches all your issues****”****.**

It's hard to get your first outage

Brain onboarding isn’t hard because signals are hard to add. It’s hard because getting to the first trustworthy outage is slow, risky, and happens entirely in prod:

Customers lack a reliable way to see what Brain would have done before enabling outage mode. As a result, they rely on forward‑looking production incidents to decide whether detection quality and noise are acceptable.

"Getting your first outage" is entirely tied to SLIs-- there is no way to meet customers where they are at. However, especially for Geneva monitors, a meaningful fraction of outages are detected but still manually declared (~15%).

Detection enablement → AOD enablement: ~6+ weeks at P50 || AOD enablement → first outage: often much longer

It's hard to go from first outage --> All outages are detected by Brain

Services must manage many monitors (per‑SLI × per‑model) and manually tune and promote each one. This leads to long onboarding cycles, heavy Brain team involvement, and delayed value. It also makes it expensive to expand coverage and difficult to introduce new detection models without multiplying configuration and operational burden

Services also lack a governed way to provide critical customer lists (e.g., S500), guardrails, or custom impact logic..

Ultimately, Intelligent Monitors address these problems by introducing a service‑level abstraction, shifting confidence earlier in the lifecycle, and creating a path for safe extensibility.

## Where We Will Be by the End of March

By the end of March, Intelligent Monitors become a real, customer‑visible concept for a controlled set of pilot services.

### What will be true

Pilot services will have one new customer‑visible Intelligent Monitor

The Intelligent Monitor sits above existing classic monitors.

It uses OPM as the first underlying model.

No existing DT/EB/status‑code monitors are deleted or hidden.

A basic Intelligent Monitor UI will be available for pilots

Customers can control detection behavior and actions (ICM team, severity, outage mode, auto‑comms).

Customers can view detection results and label detections to feed OPM learning loops.

Existing behavior is preserved

Classic monitors remain visible and continue to operate as they do today.

Intelligent Monitor is additive, not disruptive.

New service onboarding (post‑March) is flexible

New services can choose Intelligent Monitors or classic monitors.

Intelligent Monitors are recommended, but not yet mandatory.

Bottom line: March establishes the service‑level monitor abstraction with real customers, while keeping safety rails firmly in place.

March makes Intelligent Monitors real. The next phase makes them trustworthy by default — by shifting validation left, expanding model coverage, and enabling safe, governed extensibility for noise, impact, and service‑specific judgment.

## Gaps That Still Exist After March

March is a foundational milestone, not the end state. Key gaps remain:

### 1. Intelligent Monitors are OPM‑only

Only OPM is supported under the Intelligent Monitor abstraction.

DT, EB, status‑code, and other evaluators are not yet integrated.

Non‑OPM models lack consistent feedback loops, which blocks safely hiding them under Intelligent Monitors.

### 2. Validation isn’t fully shifted left

We compress the workflow surface area** (one monitor), but not the risk surface area (oh no, Brain sends me noise!).**

Users still feel like: “If I turn this on, I might page the org incorrectly” and “I need to understand why Brain will fire before I trust it.”

Early research & qualitative data implies that users are not tuning thresholds- they are tuning embarrassment risk** **and confirming effectiveness.

And customers still rely on production incidents to validate whether detection quality and noise meet their bar. Even with the March Intelligent Monitor UI, customers may still need to wait for real production incidents to build confidence. As long as validation depends on live incidents, time‑to‑value remains long

### 3. Integrated Geneva monitors are still not integrated with intelligent monitors- significant missed coverage opportunity.

Noisy Geneva monitors still require manual outage declaration.

There is no first‑class way to encode:

noise filtering rules

S500 / critical customer handling,

guardrails (e.g., canary regions), or

custom impact / SIA logic.

### 4. Intelligent monitors will still be too rigid

There is no first‑class way to encode:

noise filtering rules

S500 / critical customer handling,

guardrails (e.g., canary regions), or

custom impact / SIA logic.

## Pillars We Are Proposing (Post‑March)

## Pillar 1: Expand Intelligent Monitor model coverage

Today:

OPM is the only model used in intelligent monitors

Different models mature at different rates

DT / EB / TV / status code all fill gaps

All models require customer tuning

This points to the fact that migration from our current "per-signal, per-model" pattern is not a UI problem—it’s a trust problem.

To say “intelligent monitors replace everything,” Brain must ingest existing DT / EB / TV / status code monitors and translate them into: signals, agent instructions, and implied risk tolerance.

This requires a backend orchestration layer that:

| 1     - Balances models dynamically \(probably like OPM where strong\->fall back to anomaly models\) 2     - Preserves the existing behavior that users have spent years tuning \(at least *initially*\) 3     - Gradually converges toward unified intelligence |
| --- |

### Direction: Intelligent monitors guarantee precision & coverage

This requires a backend orchestration layer that:

| 1     - Balances models dynamically \(probably like OPM where strong\->fall back to anomaly models\) 2     - Preserves the existing behavior that users have spent years tuning \(at least *initially*\) 3     - Gradually converges toward unified intelligence |
| --- |

Users never choose the model

Using DT/EB does not require the customer to think about the parameters

This is essential for:

Migrating existing monitors

Avoiding regressions during transition

### Features:

EB & DT self-tune based on incident labels (probably with backtesting)

Bring DT, EB, status‑code, and other evaluators under the Intelligent Monitor abstraction.

Reduce the need to manage multiple classic monitors per service.

## Pillar 2: Users can preview projected detection results before enabling

Without a creation-time preview, intelligent monitors are still test‑in‑prod**.**

What is clear from research:

Users hate that tuning today requires waiting for incidents

Even a 3‑day preview would materially change confidence

### Direction: Intelligent monitors give out-of-the-box preview

On “Save signals” (or shortly after), Brain must:

Run historical backtests across all signals (We can negotiate the extent to which this preview is flushed out- this doesn't need to mean fully training OPM- the preview can be scoped or only across anomaly models. But users need some preview)

Generate expected outage behavior, not raw anomalies

And show the customer:

“In the last 90 days, this would have declared X outages”

“Top correlated signals per outage”

Then, this extends to What‑if analysis for configuration changes.

Features:

Preview experience during IM setup

## Pillar 3: Noise Tolerance as the Uber‑Parameter

We don’t need users to understand models-- we need them to control how conservative Brain is.

The "turn on" process goes from users review detections and then decide --> Users declare their risk tolerance up front, and Brain owns the rest**. **Noise tolerance is: A risk dial, not a sensitivity knob. It is the psychological replacement for “manual tuning”

### What This Unlocks

“Start me very conservative” (e.g., 95% noise tolerance)

Brain can:

Bias toward under‑firing

Gradually recommend relaxing tolerance once evidence builds

Users feel safe turning it on immediately

This is the bridge from preview → activation. However it depends on the preview to be available- noise tolerance with no preview option and interaction is ineffective.

## Pillar 4: What-if is a table-stakes experience in Intelligent Monitor configuration

Once we have a preview & noise tolerance, the ability to link the two becomes imperative. Users set a noise tolerance and Brain can generate a what-if preview for if that noise tolerance had been in production.

## Pillar 5: Extensibility via Skills (Noise Filtering + Impact)

Make intelligent monitors more extensible & customizable via "skills" that Brain has, beginning with the two that unlock coverage opportunity and address current product churn/gaps

### Noise Filtering Skill-- integrate geneva monitors

Geneva monitors as signals

Brain applies noise filtering

Outage declaration even if not full detection pipeline

From a customer POV: “I gave Brain my monitor and it made it smarter.” That counts as success—even if it’s technically a side path.

### Impact Assessment Skill (SIA without the Pain)

Users don’t always trust Brain's impact assessment, which is why we built SIA. However SIA requires ~9 parameters per signal, and setup is a pain.

What intelligent monitors need:

An impact assessment skill that:

Uses defaults

Infers reasonable impact

Allows optional custom queries (advanced users)

Impact becomes:

A supporting signal for outage confidence

Not a configuration tax

This creates a scalable path where common patterns can graduate from “skill” to first‑class feature over time.

Critical customer (S500) skills for escalation and severity decisions.

Guardrail skills (e.g., never declare outages in canary regions).

## A Coherent “Next Few Months” Arc

Putting it all together, the arc is:

### Phase 1 (V1 UI, March)

Multi‑signal intelligent monitor

OPM under the hood

Detection preview

### Phase 2 (Confidence Foundation)

Backtesting at creation

Noise tolerance parameter

Conservative default activation

### Phase 3 (Coverage + Migration)

Model composition for coverage guarantees

Backend mapping of legacy monitors

Safe migration story

### Phase 4 (Extensibility)

Noise filtering skill (Geneva as signal)

Impact assessment skill (low‑config SIA)

Future skills plug into the same monitor

## Metrics That Will Move

### Metrics that should move by end of March (pilot cohort)

Number of services with a customer‑visible Intelligent Monitor (0 → pilot cohort).

Reduced manual Brain team touches for changing OPM behavior (UI‑based control vs hard‑coded changes).

### Metrics that move once post‑March gaps are closed

**Time‑to‑Value **(aka time to first outage or time to AOD)

Improves when backtesting and preview reduce reliance on live incidents.

Detection coverage per service

Improves when multiple models are safely unified under Intelligent Monitors.

Manual outage declarations

Drops when Brain Skills absorb noisy signals and service‑specific judgment.

Correct severity and routing for critical customers

Improves with S500, guardrail, and impact‑assessment skills.
