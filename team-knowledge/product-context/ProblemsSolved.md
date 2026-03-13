---

uid: problems-solved
title: Problems that Brain solves

---
<!---
Shortlink: none
Status: draft
Type: general
Audience: service owners, anyone who wants to know what Brain can do for Azure
Learning objective: Learn about Brain's problem space
Incoming links:
--->

# Problems that Brain solves

Brain’s mission is to improve service reliability by preventing outages, minimizing customer impact from the outages that happen, and reducing human toil. To do this, it addresses certain challenges inherent in traditional health and monitoring systems. It provides health information at multiple levels of scope and uses this information to enable scenarios that earlier systems can’t support.

## Challenges with traditional health and monitoring systems

Traditional health and monitoring systems present these issues:

- **Lack of a holistic view:** In traditional systems, monitors are often configured to detect breaches in individual metrics or logs. Often, no holistic view is built into the system. When an issue occurs, multiple metrics and logs can display anomalies and create an alert storm. The lack of a comprehensive view makes it difficult to understand the situation.

- **Rising number of monitors and increasing noise:** As telemetry data volumes grow and services become more complex, the number of monitors has become unmanageable. This results in noise, high management overhead, and increased costs.

- **Challenges in configuration and tuning:** Current monitors largely rely on static rules and thresholds. This design makes it challenging to configure and tune monitors for low time to detect, high precision, and high recall.

- **Lack of built-in automation:** Most monitoring systems focus on detection and offer limited support for automation tasks such as correlation, triage, diagnosis, outage declaration, and impact assessment.

- **Lack of quality measurement and feedback loops:** After a monitor is created, there’s often no clear measurement of its ongoing quality and effectiveness and no feedback loop to suggest improvements.

- **Lack of self-learning and intelligence:** Traditional systems don’t learn from historical data or adapt based on new information. They require manual updates and reconfiguration to adapt to new conditions. This requirement results in slower response times and increased workload for engineers compared to a self-learning system.

## Why choose Brain over closing gaps between monitors?
Brain offers a paved path that gives benefits through central investment, rather than each service team doing the work and conveying information to Brain. Here's what Brain can do after it has a service’s Service Level Indicators (SLIs).
 
### Brain can determine health at multiple levels of scope
Brain translates SLIs into signals at various scopes. Brain can determine health at the resource level, the region level, the scale-unit level, and at custom domain levels. Brain can do this centrally, and we continue to invest in building better and better Brain models to drive precision and recall up. This process lets Brain correlate multiple signals simultaneously, looking for a pattern anomaly versus a single-signal anomaly. This approach requires specialized machine learning (ML) training, which isn’t something every service team can invest in.

### Brain can use data gathered to enable multiple service-health scenarios 
With SLI health information fully integrated, Brain can enable a number of benefits.

| Benefit                                                                | Why Brain + SLIs?                                                                                                                                                                                                                                                                                                                                                                                                                                         | Service monitor equivalent                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Detect issues, declare outages, and communicate to customers           | Brain integrated with SLIs performs these actions automatically, because by definition SLIs contain the relevant customer impact information.                                                                                                                                                                                                                                                                                                             | Each service team needs to author service monitors and send the information to Brain. Usually, service monitors are authored in reaction to outages or incidents and don’t identify customer impact.                                               |
| Stop deployments                                                       | Services using Ev2 managed deployment will automatically benefit from Brain checking service health in early stages of deployment and giving a signal to the deployment systems to stop a deployment if it becomes unhealthy. We are actively working on improving sensitivity here so we can catch the tiniest of tremors in SLIs to stop deployments without introducing too much noise. This indicator can also be optimized for the scale-unit scope. | To achieve the same result by using Mobile Device Management (MDM) monitors, service teams must write custom service monitors and integrate these with Brain. Unfortunately, Brain currently doesn't have this integration point easily available. |
| Triage and assess transitive impact                                    | Using resource-to-resource level dependency and resource level health, Brain has a full-system view of the impact graph. Brain can thus automatically triage or create correlated incidents with transitive severities attached for services below Azure Resource Manager (ARM) level, at ARM level, and above ARM level.                                                                                                                                 | There's no Brain equivalency yet for integration for triage based on service monitors. Even if there were, to create this impact graph service teams must author monitors or update existing monitors to give Brain resource health information.   |
| Visualize health at various scopes                                     | [Brain Cloud Health](xref:brain-cloud-health-overview) provides global, regional, per-service, and per-custom-scope health views that are relevant for teams, and also for individuals looking for multiservice health status, especially when working on service issue mitigation. Our customers love to see the various services coming back online. Zone Down Drills also use Brain Cloud Health.                                                      | Brain can show only outage status for services that integrate only monitors and don’t have SLIs.                                                                                                                                                   |
| Provide resiliency feedback                                            | The resiliency workstream looks at Brain to provide feedback on whether resources that claim to be zonally resilient truly are zonally resilient.                                                                                                                                                                                                                                                                                                         | There's no equivalency for service monitors.                                                                                                                                                                                                       |
| Give a true determination of customer-specific health (future feature) | One feature that customers often ask for is the ability to tell whether a specific customer is impacted when most other customers aren’t. This level of granularity is only possible with SLIs that provide resource-level metrics.                                                                                                                                                                                                                       | Brain currently doesn’t have integration of service monitors that can provide per-customer health states.                                                                                                                                          |

For general information on what Brain does, see [What Brain is and how it works](xref:what-is-brain). If you can't find what you're looking for, try [Brain Support](https://aka.ms/brainhelp).

## Brain capabilities compared to Geneva monitor capabilities

Brain integrated with SLIs offers improvements over Geneva monitoring. The following table compares the capabilities of: 

- Brain fully integrated with SLIs.
- Geneva monitors integrated with Brain.
- Geneva monitors on their own.

| Capability | Brain + SLIs | Brain-integrated Geneva monitors | Geneva monitors |
|-----------|-------------|----------------------------------|-----------------|
| View health in [Brain Cloud Health](xref:brain-cloud-health-overview) | ✅ | ❌ | ❌ |
| View Azure region health | ✅ | ❌ | ❌ |
| View dependency health | ETA 2026 | ❌ | ❌ |
| View per-customer health | ETA 2026 | ❌ | ❌ |
| Get reduced time to outage | ✅ | ❌ | ❌ |
| Get auto-tuned alerts | ✅ | ❌ | ❌ |
| Get automatic deployment stoppage | ✅ | ❌ | ❌ |
| Customize alert email | ❌ | ✅ | ✅ |
| Get automatic outage declarations | ✅ | ETA 2026 | ❌ |
| Get correlation of incidents to service health issues | ✅ | ✅ | ❌ |
| Get automatic population of IcM impact assessments | ✅ | ✅ | ❌ |
| Get troubleshooting guide links in IcM incidents | ✅ | ✅ | ✅ |
| Get automatic [Brain Health Checks](https://eng.ms/docs/products/brain/auto-triage/auto-triage-overview#how-does-brain-auto-triage--diagnosis-work) | ✅ | ❌ | ❌ |
| Create custom dashboards | ❌ | Manual | Manual |
| Get diagnostic insights | ✅ | Manual | Manual |
| Get Auto Comms and automatically invite communications manager | ✅ | ✅ | ❌ |
| View impacted resources | ❌ | ✅ | ✅ |
| Get automatic outage mitigation | ETA 2026 | Opt-in | Opt-in |

### Next steps
- [Get started with Brain.](xref:get-started-with-brain)
- If you can't find what you're looking for, try [Brain Support](https://aka.ms/brainhelp).

<!---------------------------------------------------------------------------------->
[!include[Footer](~/footer-common.md)]
<!---------------------------------------------------------------------------------->