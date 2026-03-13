---

uid: get-started-with-brain
title: Get Started with Brain

---

<!--
Shortlink: none
Status: draft
Open items:
Type: General purpose
Audience: service owners, anyone who wants to know what Brain can do for Azure
Learning objective: How to get started with Brain
Incoming links:
-->

# Get started with Brain
To start using Brain, you can either create Service Level Indicators (SLIs) to let Brain monitor your key customer scenarios or integrate existing service monitors with Brain. We recommend creating SLIs to take advantage of all Brain capabilities, but you can start using many Brain features today by integrating existing service monitors.  

Following is a comparison of Brain capabilities enabled for SLIs vs. service monitors.

| Brain feature                                                                                                                                                     | Benefits                                                                                                                                                                          | SLIs | Service monitors |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------|------------------|
| [Auto Detection](xref:detection-sli-arm)                                                                                                                          | Significantly reduces time to detect. Auto Detection constantly streams service health metrics and removes the need for manual detection, resulting in faster on-call engagement. | ✅   | ✅              | 
| [Impact assessment](xref:impact-assessment-widget)                                                                                                                | Enables quick understanding of the customer impact of an outage, because Brain includes the resources impacted in the incident.                                                   | ✅   | ✅              | 
| [Auto Outage Declaration](xref:auto-outage-declaration)                                                                                                           | Automatically declares outages based on observed customer impact, ensuring the right people are engaged faster.                                                                   | ✅   | ✅              | 
| [Auto Comms](xref:auto-comms-overview)                                                                                                                            | Automatically notifies impacted customers of a service outage, improving customer communications and allowing incident managers to focus on accelerating mitigation.              | ✅   | ✅              | 
| [Auto Triage](xref:auto-triage-overview)                                                                                                                          | Automatically identifies the service responsible for an incident or outage, allowing designated response individuals to more quickly focus on incident mitigation.                | ✅   | ✅              | 
| [Brain Cloud Health](xref:brain-cloud-health-overview)                                                                                                            | Enables viewing the health of Azure services, including service outages and outage recovery status.                                                                               | ✅   | ❌              | 
| [Deployment health stops](https://ev2docs.azure.net/features/rollout-orchestration/managed-validation/service-health.html?q=A%20complete%20SLO%20contains%20both) | Monitors service health during deployments and stops a deployment if the service becomes unhealthy.                                                                               | ✅   | ❌              | 

---

## Start using Brain by integrating SLIs

> [!NOTE]
> With Brain Auto Detection, your service automatically gets [impact assessment](xref:impact-assessment-widget) and [Auto Triage](xref:auto-triage-overview). *Impact assessment* provides quick understanding of the customer impact of an outage, because Brain includes the resources affected in the related Incident Management (IcM) incident. *Auto Triage* analyzes dependency health to identify which service caused a given outage.


To start using Brain by integrating SLIs:
1. Author high-quality SLIs for your service. To learn how to write SLIs with Brain in mind, see [How to write SLIs that work for Brain](https://eng.ms/docs/products/brain/brain-detection/detection-adopt/detection-sli-how-to/detection-sli-step-0#how-to-write-slis-that-work-for-brain).
2. In the [Brain team’s channel](https://aka.ms/brain/qna), request that the Brain team onboard your service for Auto Detection. A minimum quality score of 2 out of 4 for each SLI is required for Brain onboarding. Higher scores reflect better data quality and better correlation between SLI values and outages.
   
   When Brain has capacity, Brain integrates your service SLIs. To check onboarding status, see the [Manage Brain Monitors](https://portal.microsoftgeneva.com/brain/configure/monitors) portal.
  
   Brain automatically creates a Brain monitor for each success rate and availability SLI signal, set to create Sev3 incidents by default. A *Brain monitor* checks service signals, specifically in the current case SLIs. When you use a Brain monitor, Brain performs both detection and impact assessment. In contrast, when you use a service monitor integrated with Brain, the service does the detection and sends the information to Brain to do impact assessment.
   
   For information about requesting latency SLI signals to be onboarded, see the [Detection Onboarding FAQ](https://eng.ms/docs/products/brain/brain-detection/detection-faq). 
   
3. Check detection quality by reviewing Brain-created incidents in Incident Management (IcM).
4. When you reach 6 or more incidents with 70% or more good detections, [configure the monitor](https://aka.ms/brain/) to create Sev2 incidents and automatically declare outages. For select [Azure Quality Critical Services (QCS)](https://eng.ms/docs/initiatives/quality-and-security-critical-programs-qei-sfi/cohorts/qcs), Brain automatically enables outage declaration after the SLI quality score is greater than or equal to 3. 

After outage declaration is enabled, you can also configure other Brain capabilities. For more information, see [After Auto Outage Declaration](xref:get-started-with-brain#after-auto-outage-declaration-using-other-brain-features), following.

For more information about how Brain detects outages, see the [Auto Detection overview](xref:detection-overview).

---

## Start using Brain by integrating service monitors
You can also use Brain by integrating your service’s monitors. However, right now this method provides only limited Brain capabilities due to its indirect measurement of customer impact.

To start using Brain by integrating a service monitor:

1. Configure your monitor to create an IcM incident each time it detects an event that impacts customers.

2. Set up an IcM Automation flow that listens for IcM incidents from your service and reports impact for each incident to Brain.

This approach works with any type of monitor, including both Geneva monitors and other types. With a service monitor integrated with Brain, the service performs detection and sends the information to Brain to do impact assessment. 

For more information, see [Auto Outage Declaration (via IcM Automation)](xref:auto-outage-declaration).

After outage declaration is enabled, you can also configure other Brain capabilities. For more information, see [After Auto Outage Declaration](xref:get-started-with-brain#after-auto-outage-declaration-using-other-brain-features), following.

---

## After Auto Outage Declaration: Using other Brain features

After you enable outage declaration for your Brain monitor, you can enable additional Brain features, continue to gather data, and improve detection.

### Enable additional Brain features

After your service has Auto Outage Declaration, you can enable:

- [Auto Comms](xref:auto-comms-overview), which posts outage notifications to customers to keep them informed and [to help reduce support requests](xref:brain-home).

- [Brain Cloud Health](xref:brain-cloud-health-overview), which checks the health of other Azure services that your service might depend on. For example, you might use this feature during a multiservice outage. 

- [Deployment stops](https://ev2docs.azure.net/features/rollout-orchestration/managed-validation/service-health.html?q=A%20complete%20SLO%20contains%20both), for services using the EV2 deployment system. The EV2 deployment system checks Brain health data during deployments and can automatically stop a deployment when Brain indicates the service has become unhealthy.

### Continue to gather information and improve detection

After a service is using Brain:

- The service team [reviews declared outages and provides feedback](xref:slo-sli-detection-step-2), especially in cases of suspected false positives.

- The service team can also view data on detection precision, detection recall, and time to outage declaration by using [Brain Analytics](https://aka.ms/BrainAnalytics). 

- To improve detection quality, service teams can work to identify issues causing noisy detections, called false positives (FPs), or missed detections, called false negatives (FNs), or both. To investigate these, check [Improving Brain Precision & Recall](https://eng.ms/docs/products/brain/brain-detection/detection-fp-fn-analysis/improve-precision-landing), attempt to determine the cause of the FP or FN, and take the recommended action.

- If your investigation doesn’t succeed, [submit an investigation request](xref:brain-support-model). The Brain team then performs root cause analysis. You can view results in the [Brain Repair Items Dashboard](https://msit.powerbi.com/groups/2769a60b-8a23-422e-aa42-25d723ed0b4d/reports/11212e3e-3f87-48cc-bfd2-fd956cda5193/a42ac15661806c2a87eb?experience=power-bi).

### More information

- Interested in learning more about Brain? 
  - [Get a top-level overview](xref:brain-home).
  - [Read more about what it is and how it works](xref:what-is-brain).
- If you can't find what you're looking for, try [Brain Support](https://aka.ms/brainhelp).

<!---------------------------------------------------------------------------------->
[!include[Footer](~/footer-common.md)]
<!---------------------------------------------------------------------------------->