Multi-signal Monitors

[Epic ID & Name]

Author: Matt Hetrick

Status: Draft

Last Updated:  1/6/2026

# Overview

Our goal with Brain detection is to improve service reliability by detecting a larger percentage of issues faster (the faster we detect something, the further left we can go- we still need to detect something to prevent an outage). There are a few main strategies to do this:

Innovate new ways of detection that close old gaps, such as creating new models that can look across a service and learn from old outage patterns

Add more services, and allow existing services to add more scenarios, to detect more things across the platform

Rapidly repair issues impacting the efficiency of monitoring an existing scenario

Current Brain monitoring is fragmented, manual, and lacks explainability. If we build a unified, extensible Brain detection offering that automatically ingests all service signals and enables scenario-based detection with minimal configuration, then we will reduce missed outages, accelerate onboarding, and improve user satisfaction.

Previous work: One Brain monitor per SLI signal.docx, Proposal of Parameter Free Monitors.docx

## Background & Problem Statement

Brain monitors currently face 2 main issues:

It’s hard to get started & get your first outage using Brain monitors

Once you get an outage, it’s difficult to improve how well Brain can monitor your service (i.e. get to 80+% coverage at fast TTO & TTM)

Today we have signals, detection models, and monitors joined in a 1:1:1 relationship. Signals are input data, detection models are entities that intake signals and output an anomaly, and a Brain monitor is something that ingests an anomaly and does something with it. Detection models and monitors are manually tuned and manually managed, and the configuration experience is confusing. We have a great opportunity to better adhere to the principles above to make it easier to empower customers to achieve high service reliability.

## Users & User Problems

### Users

Primary: Service owners, incident managers, and SREs across Microsoft services using Brain.

Secondary: Brain team & CXP SRE team onboarding services & tuning monitors to achieve high outage coverage with fast TTO Engineering teams onboarding new services into Brain.

### User Problems

Current monitoring approaches in Brain have several limitations relative to the principles above:

Service owners have a hard time achieving high coverage using the existing models due to a high overhead for detection innovation. Coverage is limited when signals are monitored in isolation, a hypothesis proven by multiple requests for multi-dimensional anomaly detection and the early outputs of the OPM. The current framework constraints detection model innovation since currently supporting each new model in the product requires a new monitor type and introduces new user-facing static parameters.

Users must follow many steps to get detection set up & running for all their scenarios, resulting in a long time to just get started. This has a few reasons:

Users need to set up everything per-signal due to the 1:1:1 relationship between signals, detection models, and monitors, and multiple signals often share the same metadata & settings since they monitor the same service component or planes. Services want to group these SLIs (e.g., by control/data plane or segments of a service) for more actionable and targeted monitoring.

No clear testing story, as today users “test” by reviewing Sev3 incidents.

Setting up Brain is long & arduous, a problem solved with a different spec

Hard to improve coverage due to high support cost to get detection working well

Users must manually request Brain team help to tune each detection (3 days per FN, up to 2 days per FP) done per monitor per service means N days * M detections * X monitors * Y services. As Y and X increase, this support becomes unscalable.

Low visibility into what the monitor is doing, which increases manual support pings and takes longer to improve reliability

Takes a long time to make consequential updates resulting in low user satisfaction and increased support load due to a lack of insight into how configuration settings impact detection results.

These problems are validated by:

Many abandoned/stale monitors that never reach outage mode

Significant eng hours spent by SRE & Brain teams working with services manually to “tune” each individual monitor

Support tickets requesting multi-dimensional anomaly detection.

Feedback from service teams struggling with monitor setup and tuning.

Internal analysis showing high false positive/negative rates in current monitors.

# Goals & Non-goals

## Goals

| No. | Goal | Priority |
| --- | --- | --- |
| 1 | Users only need to add their SLIs and enable a default monitor to get Brain detecting outages | P0 |
| 2 | Users do not need to tune anything to get good detection results | P0 |
| 3 | Users trust and feel in control of Brain’s outage detection outputs | P0 |
| 4 | Reduce missed outages by enabling multi-signal detection | P1 |

| No. | Non-Goal |
| --- | --- |
| 1 | Replace existing Brain detection models wholesale |
| 2 | Supporting non-Brain monitoring platforms |
| 3 | Make it easier to onboard to Brain (addressed in different spec) |

# Success Metrics

| No. | Type   (Biz, Cust, Tech) | Outcome | Metric | Pri |
| --- | --- | --- | --- | --- |
|  |  | Lower support cost | Reduced support requests related to monitor configuration/tuning |  |
|  |  | Faster onboarding | Reduced median time from SLI onboarding to outage mode |  |
|  |  | High user satisfaction | ≥80% positive feedback in user surveys Number of post-onboarding manual adjustements |  |
|  |  | Extensible model development | Number of new product features to productize a new model |  |

Contributing Teams / Collaborators

| No. | Requirement or Deliverable | Producing Team |
| --- | --- | --- |
|  | Model integration, noise tolerance, what if preview | Brain Models |
|  | Configuration panel | Brain Experience |
|  | Brain can detect on a multi signal monitor | Detection 2.0 Team |

# Vision & Details

Brain will monitor services to look for problems. It will do this by leveraging entities we call Brain monitors.

The general tenets of Brain monitors are:

Brain monitors are extensible and durable, not requiring significant work to support rapid detection capability development.

Brain monitors are easy to manage, explainable, and trustworthy, empowering users to leverage Brain with confidence.

Brain monitors are simple to set up & get value quickly. Defaults should work well out of the box, and users can customize to best fit their service.

To reach these tenets, we need to adopt the following core definitions of Brain monitors:

Signals are inputs to Brain; they can be SLIs, other types of monitoring, or external sources like support cases.

Brain looks for issues with these signals

These signals that can be grouped (for example, by service component or control/data plane) into monitors.

A monitor is uniquely defined by the signals it monitors and the routing logic (IcM team and/or downstream systems)

New models and new signal types do not require new monitor parameters. Users can only control noise tolerance which tunes the backend models to the “aggressiveness” of the monitor.

A monitor will have specific policies that determine how Brain should interpret the signals and inform which actions should be taken. Brain will set defaults for each detection policy, and those defaults will get more intelligent over time. More details on these policies below.

Users can preview detection results before turning on a monitor or before making any configuration change

Brain will only automatically make 1 default monitor for the service that groups all signals from the service. Over time we will explore more intelligent default groupings.

Existing monitors still need to be supported even as we introduce service-level/multi-signal monitors.

## Policies

Below are the initial policies monitors should support. We will continuously evaluate adding more policies over time, detailed in the “future iterations” section.

(WIP) Evaluate Resource Health: Users can configure how Brain should evaluate resource health for the signals of the monitor. All SLIs of the same category within a given monitor should share the same health calculation policies (TBD- may need a per-signal configuration).

Detection Scopes that determine what aggregations of data Brain should look at for issues (e.g., service, region, cluster)

[Future] Detection Logic: Users can configure a noise tolerance for how aggressive the Brain alerts should be based on feedback in Microsoft Forms. The tolerance lever can start as a % acceptable noise. For example, if the bar is set to 15% acceptable noise, then Brain will tune the monitor (via tuning the combination of underlying models) to ensure the monitor stays at a >=85% precision.

Action policies:

Allowed Incident Severities: Sev3, Sev2+

Outage declaration on/off

Custom outage criteria- this should be in the form of “is there anything Brain should not do”

Auto-comms on/off and template selection

Scopes selection

[Future] can explore policies around wobbles/deployments

Enrichments:

TSGs

Auto-Diagnostic insights

A more detailed table of how this compares to today, with changes highlighted in green:

| User Capability | Today | Today | Today | Kr | Kr | Kr |
| --- | --- | --- | --- | --- | --- | --- |
| User Capability | User Knobs | Default Value | How to set | Knobs | Default value | How to set |
| Turn monitor on/off | On/off | On | UX | On/off | On | UX |
| Select which signals Brain uses for the monitor | Not supported | Not supported | Not supported | Signal selection | All *Existing monitors will only have 1 signal selected | UX selection |
| User input for how should Brain evaluate resource health | Baseline- SLO Target or Brain decides *SIA in preview | Brain decides | UX for baseline or GitOps for SIA | Brain decides or custom | Brain decides | UX selection with formatted entry for custom (SIA) |
| User inputs to control detection logic | Depends on model StdHealth: Count/% thresholds EB: burn rate, duration, etc… | Depends on model StdHealth: Estimation function for counts EB: Default EB params for burn rate, duration, etc… | Depends on model StdHealth: Change thresholds in UX EB: Change params in GitOps | Noise tolerance *Existing monitors can have previous logic as "advanced" or via GitOps | 15% | UX slider |
| Actions- Incident Alerting | Sev3, Allow Sev2 | Sev3 | UX selection | Sev3, Allow Sev2 | Sev3 | UX selection |
| Actions- Outage Declaration | On/off | Off | UX toggle | On/off | Off | UX toggle |
| Custom Policy- Outage criteria | Depends on model StdHealth: uses detection logic counts EB: outage-specific count/duration | Depends on model StdHealth: n/a EB: 50 subs/10 min | UX entry | Custom count/duration | None *Existing monitors get the count/duration that is used today | User can enter a custom value if desired |
| Route Brain detected issues | IcM team selection | None- user must set | UX search | IcM team selection | None- user must set | UX search |
| Auto-comms | Toggle on/off Select templates | Off, no template selected | Set via separate config UX | Toggle on/off Select templates | Off, no template selected | UX section |
| Add enrichments to Brain detected issues | TSG selection Diagnostic insights (crash and log insights) | Brain default TSG, no diagnostic insights | TSG set in UX entry Diag via separate config experience | TSG selection Diagnostic insights (crash and log insights) | Brain default TSG No diagnostic insights | UX section |
| Select which scopes Brain should look at | Pick any available scopes | Region | GitOps | Pick any available scopes | Region | UX selection |

## Monitor Configuration Experience

All Brain monitors should have a consistent pattern:

Basics: Name, On/off, Current performance, Inputs

Policies: Configure the intrinsic properties of a monitor & any customization

Interactive feedback section [described above]: Users can review detection results (like noise or missed detections) and/or see projected detection results (that can be in response to user feedback)

Chat assistance for Q&A, explanations, and natural language configuration.

### Setup Experience

Services will receive an out-of-the-box intelligent Brain monitor that uses all the high-quality signals a service has defined. Users simply review the monitor results preview & enable. If users have questions with the preview, they can ask the chat about the preview results and learn if any settings should be changed.

### Interactive Feedback ("What-If" Experience)

The interactive feedback section should initially support 2 main user scenarios:

Users can “preview” the monitor outputs and projected metrics over a historical timeframe to gain confidence in the training of the monitor before enabling

Users can see a “what-if” preview of the monitor outputs in response to adjusting the noise tolerance slider or adding/removing scopes

This could be implemented as a dynamic table of outage detections as was explored in a Brain Scan POC and sketched below:

In the future, it could support a FP/FN investigation scenario:

Users can see a list of the outages the monitor has detected and update/add a FP/FN label on the outage to give feedback to the monitor. Should require some rationale for why it is a FP/FN

Clicking into a detected outage opens the incident explorer for investigation of noise or missed outages

In the investigation, users can challenge Brain’s logic, and brain can explain trade-offs (e.g., user wants Brain to ignore something, Brain provides explanation that it can do it, but doing so will have X impact on recall vs. precision)

A version of this is more flushed out in Brain OPM Experience.docx

### Versioning

Versioning a specific monitor is simply iterating on the settings of the monitor. This can be in response to a major/minor Brain detection offering version, or as a tweak to an existing monitor due to new information. All versions of a specific Brain monitor should be logged in the Brain changelog.

There are 2 main types of specific monitor versioning:

Service team versioning: Create/Update/Delete SLIs or other signals, change a detection “policy” like adding new detection criteria

Brain system versioning: Promote/demote monitors, updating parameters, enabling new detection models, enabling new detection features, etc.

#### Monitor versioning

Service team versioning:

Signal creation/addition: For new SLI signals or users adding a new external/other signal to Brain, users should receive a “what-if” experience to preview the monitor behavior with that new signal included. This experience should leverage the “feedback + preview” section of the monitor configuration and show how the detection metrics & outage/incident list changes.

This should be time-bound such that for a new SLI signal, Brain can generate this list immediately, but if a month passes, the user would have to initiate the preview simulation which may take some time to run. This allows users to add signals to monitors after the fact while still biasing for an easy setup flow for brand new signals.

Signal Update: Brain will not provide any monitor-specific experience for signal updates. The user assumes responsibility for making an impactful update to an SLI signal for a Brain monitor. In the future, we can explore how to allow users to simulate Brain behavior for SLI signal updates.

Signal Deletion: If the user deletes a signal a monitor uses, warn the user via email and a UI flag in the SLI authoring experience requiring explicit attestation that they are deleting an SLI used by a Brain monitor and they should preview the detection results ahead of time. In this case, they should be able to schedule a deletion after previewing the impact of the deletion on the monitor outputs.

Brain system versioning: Auto-management is a key feature of the Brain monitor. Therefore, Brain should make changes automatically, updating the changelog, and only when Brain automatically enables/disables a capability (such as AOD) will it send customer notifications. This allows for constant monitor optimization without bombarding customers with notifications.

#### Introducing new models

Brain should have a mechanism for allowing flexible monitor updates to the detection offering. The detection offering versioning is like iOS, whereas the specific monitor versioning mentioned in the above section are like apps running on iOS.

Major updates are significant updates to functionality of the monitor that requires a user to change their workflow or breaks existing configurations. Announcing a major version should follow the best practice of sending a “heads up” and a “work complete” notification that provide clear rationale & benefit and highlight any required actions.

Examples: deprecating certain Brain models, a full overhaul of the user-configurable parameters, a new chat-based paradigm of configuration.

Minor updates are updates such as new features, enhancements to existing features, or non-breaking changes that may or may not require a user to take an action. Brain should send an announcement and highlight the new functionality in the UX, but enablement should come from the user. However, users should have a way to “always allow” automatically enabling new capabilities or enhancements.

Examples: new versions of Brain detection models, new Brain detection models, new custom policy support, etc.

# Kr Features [Needs some updating]

Kr Goal: Unified Brain monitor complements existing, per-signal solutions

By the end of Kr, there will be one monitor type (the intelligent Brain monitor) that can use any number of signals.

For new services, Brain will give an out-of-the-box intelligent monitor that uses all signals. All services need to do is integrate their signals, add their IcM team for routing, and enable the monitor. Services can then optionally adjust default policies and add new monitors as desired. Existing SLI+Brain monitors will be migrated at a later point in time.

Over time we will continue to simplify this towards a unified monitor vision and allow more flexibility to group signals. A sample design pattern for what this monitor could look like: https://brain-gen2-monitor.vercel.app/.

Why this as phase 1: Many services have worked hard to achieve high coverage and precision with the existing monitors. Moreover, there is only 1 multi-signal model (OPM) that is still very nascent. Thus, we introduce a multi-signal monitor alongside the existing solutions to continue to support our customers while introducing and iterating on a true AI monitor paradigm.

### Version 1

Goal: Improve usability of monitor config, make extensible for future improvements

Description: Users can edit SIA and scopes from UX. Monitor configuration pattern adjusted based on user research with policies are configured together and unused settings removed or hidden in “advanced” settings. Users should be able to see detection results in the config.

Needles we should see moved: Reduced support cost for scopes & SIA, improved user sentiment around Brain monitors experience from teams channel

| Feature | Problems Solved | Half | Priority |
| --- | --- | --- | --- |
| Users control the monitor’s behavior by editing policies & enrichments on the monitor: IcM team selection, resource health evaluation, incident severity, outage declaration, auto-comms, TSG, diagnostic insights. CRID type and baseline go away in favor of “Brain decides”, “Compare to SLO target” | Confusion and lack of confidence in detection settings |  | 0 |
| User can select the detection scopes of a Brain monitor | Missed outages, lack of confidence in detection settings |  | 0 |
| SIA can be set via “Let me tell Brain” how to evaluate resource health for single-SLI Brain monitors | Missed outage, lack of confidence in detection settings |  |  |
| Users can see the past outages a monitor has detected in the Brain configuration | Low visibility into what the monitor is doing |  | 0 |
| Auto-comms and auto-diagnostics are set as part of the Brain monitor configuration | Confusion and lack of confidence in detection settings |  |  |

### Version 2

Goal: Brain can use multiple models (that look at 1 signal) with needing separate monitors

Description: For existing Brain monitors, users can only adjust noise tolerance and see a preview of how that affects detection results. All other parameters are put in an “advanced” section that will eventually only be available to power uses.

Needles we should see moved: Reduced support cost (volume & time) for setting detection parameters,

| Feature | Problems Solved | Half | Priority |
| --- | --- | --- | --- |
| Users can adjust a noise tolerance and the signals for a monitor to see a “what-if” preview” of the monitor results | High tuning support, Lack of confidence in detection settings |  | 0 |
| Users do not have to manage a separate monitor for each detection model (one monitor per SLI). | High tuning support, “monitor overload” |  | 0 |

### Version 3

Goal: Brain monitors can now use all the signals for a service, leading to faster outage mode enablement time & immediate high coverage.

Description: Brain monitors can now use all the signals for a service in addition to looking at 1 signal. All existing monitors convert to a flavor of this monitor type that uses 1 signal.

Instead of making one monitor for every signal when a service is onboard, Brain now only automatically creates a single Brain monitor that uses all service signals by default, and these monitors include a “preview” of the detection results the service can review before turning on the monitor. Services can add other single-signal monitors as desired. New production SLI signals are automatically added to this monitor.

Needles we should see moved: reduced time to enable outage mode, reduced time to receive first outage, reduced support cost for setting detection parameters

| Feature | Problems Solved | Half | Priority |
| --- | --- | --- | --- |
| All existing SLI monitors are converted to Gen2 monitors with 1 signal selected. Existing params go under an “advanced” section in the new monitor | Missed outages, model innovation is constrained |  | 0 |
| When a service onboards, they get a Brain monitor that uses all of their SLIs by default, and they can review a “preview” of the detection results backtested on historical data | No clear testing story, Lack of confidence in detection settings | Q1 | 1 |

### [Stretch] Version 4

Users can now add/remove signals from a Brain monitor, allowing them to make more monitors that use different groupings of signals to better monitor their service (like data/control plane, or different service components). Users can preview these new monitors before saving. Users can now also preview monitor performance changes due to adding/removing signals and resource health evaluation changes.

| Feature | Problems Solved | Half | Priority |
| --- | --- | --- | --- |
| Users can select/unselect signals, including test signals, for the monitor and see a “what-if” preview” of the monitor results | Lack of confidence in detection settings |  | 2 |
| For ANY new monitor, users can “preview” the detection results backtested on historical data | No clear testing story, Lack of confidence in detection settings |  | 2 |
| Users can change the resource health evaluation criteria and see a “what-if” preview” of the monitor results | Lack of confidence in detection settings |  | 2 |

### [Stretch] Version 5

Versioning reduces config error risk: Users can version a monitor to roll back to an old version if changes to a monitor lower performance

Agentic config improves usability- Users can use chat to ask Q&A and understand the monitor settings

## Future phases

Configuration should be done in the Brain portal as “Brain | Detect”

Other features for future consideration:

Configuration/Usability:

Agentic config

Additional monitor states (muted, active, etc.)

Custom monitor names

Inputs:

Intelligent signal grouping

Policies:

Resource health evaluation via natural language

Different noise tolerances for different severities

Can send outages to downstream systems

Additional diagnostics automatically included

Intelligently determine scopes for detection

Custom outage policies via natural language (like only declare outage if S500 customer is impacted)

Auto-mitigation

General product:

Users should also be able to clearly see this monitor’s performance relative to their existing per-SLI monitors since we want to guide users to decide to fully adopt the single monitor.

# Appendix

## Roadmap

Objective: Transition from each monitor tied to a single SLI and model to a unified Brain offering that intelligently blends multiple models and signals.

New service journey

Create signals

Validate signal quality

Simulate signal performance in Brain if possible

Integrate signals with Brain || Onboard to ARG

Brain sets up for health and creates default monitor

Profile signal(s) and enable the right blend of models

Service opts in to monitor/detection || Service optionally adds more monitors

Can have outage turned on immediately if monitor has enough data

Review data of monitor, eventually turn on outage mode

Enable comms

Continuous improvement

Provide feedback on monitor performance & understand detections

Brain improves product capabilities to better support customers

New signal journey

Author signal

Simulate signal performance in Brain

Add signal to Brain

Brain profiles the signal to determine best model

User chooses monitors signal should be added to (or Brain auto does this)

New models journey

Brain creates POC for new model

New model can be added to monitors via CaC

Once more mature, new model updated/added to applicable monitors logged in Brain changelog

If model significantly changes performance or is a fundamentally new model, iterates version of Brain detection. Can be offered as beta or preview or something
