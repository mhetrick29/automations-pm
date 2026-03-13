---

uid: what-is-brain
title: What Brain is and how it works

---

<!---
Shortlink: none
Status: draft
Type: general
Audience: service owners, anyone who wants to know what Brain can do for Azure
Learning objective: Learn about Brain's main capabilities
Incoming links:
--->

# What Brain is and how it works

Brain is Microsoft’s AI health and monitoring system, designed to help you understand service health status and manage service outages quickly and effectively. Brain can significantly improve service reliability by reducing the time it takes to:
- Detect and declare outages.
- Notify customers about outages.
- Identify the service responsible for an outage.

Brain can also:
- Stop unhealthy deployments.
- Help assess which customers and resources are impacted by an incident.
- Show service health status over time and across regions.

To do this, Brain continually ingests Service Level Indicator (SLI) or service monitor data. When one or more signals indicate a potential issue, Brain applies statistical models to determine if there’s an outage. Brain also shows the resources affected in the issue’s Incident Management (IcM) incident to help assess customer impact. The EV2 deployment system checks Brain health data during deployments and can automatically stop a deployment when Brain indicates the service has become unhealthy. If there is an outage, [Brain can auto-declare it](xref:auto-outage-declaration) and initiate a coordinated response faster than humans can raise the alarm. 

As part of the response, [Brain Auto Comms](xref:auto-comms-overview) posts outage notifications to customers, which keeps them informed and helps reduce support requests. At the same time, [Brain Auto Triage](xref:auto-triage-overview) analyzes dependency health to identify which service caused the outage. During a multiservice outage, you can use [Brain Cloud Health](xref:brain-cloud-health-overview) to check the health of other Azure services your service might depend on.

## Key capabilities of Brain

By using Brain, you can:

### 🔍 Detect outages faster, with less work.
- AI-based monitors detect outages 68% faster than without Brain integration.
- Brain integration reduces configuration toil.
- [Learn more.](xref:detection-overview)

### 📊 Understand service health at a glance.
- Visualize cross-service impact in Service Health.
- View regional and dependency health.
- [Learn more.](xref:brain-cloud-health-overview)

### 📣 Communicate to customers automatically.
- Faster communication reduces the risk of CritSits.
- Brain reduces work for designated response individuals and incident managers to communicate with customers.
- [Learn more.](xref:auto-comms-overview)

### 🧭 Triage issues to the responsible service automatically.
- Brain automatically identifies the service responsible for an outage.
- Brain links each outage to the incident that caused it.
- [Learn more.](xref:auto-diagnose-overview)

### 🧠 Diagnose issue root causes automatically.
- Get AI-powered diagnosis with minimal configuration.
- Locate the exact change causing regression with Brain.
- [Learn more.](xref:auto-triage-overview)

### 📈 View Brain metrics to improve your Brain implementation.
- Track adoption, detection, and SLI quality.
- [See the Brain Quality Hub dashboard.](https://aka.ms/BrainAnalyticsHub)

## How Brain works

- **Brain detects and alerts on customer impact.** Based on its view of service health, Brain determines if an issue is causing customer impact. It establishes the level of impact and sends alerts as needed. [Learn more.](xref:detection-overview)

- **Detection triggers intelligent actions: Auto Triage, Auto Diagnosis, and Auto Comms.** When Brain detects an issue and sends an alert, it:
    - Creates and sends an IcM incident to the service team impacted by the issue. [Learn more.](xref:detection-linking)
    - Automatically runs Auto Triage to report the issue to the team that can fix it, avoiding a long search for a designated response individual (DRI). [Learn more.](https://eng.ms/docs/products/brain/auto-triage/overview)
    - Automatically runs Auto Diagnosis so DRIs get insights to act on immediately. [Learn more.](xref:auto-diagnose-overview)
    - If Auto Comms are turned on, automatically sends outage communications to impacted Azure customers. This step drastically reduces time to notify. [Learn more.](xref:auto-comms-overview)
    - Halts deployments as needed, for services using Ev2 managed deployment.

- **Analytics will improve detection.** In the future, health modeling and analytics will continuously identify opportunities to improve Brain anomaly detection and thus Azure reliability. This might mean:
    - Improving SLI signal quality to better represent service health.
    - Adding new SLIs to cover missed outages.
    - Automatically adjusting Brain detection to improve precision.

    [See current Brain analytics on the Brain Quality Hub dashboard.][brain-analytics-link]

[brain-analytics-link]: https://msit.powerbi.com/groups/me/apps/bcdcd236-802b-4b57-b060-9c2602db8189/reports/053b7bbd-c172-4222-a99b-56cb1a40419a/784ef9d9d93436950d91?ctid=72f988bf-86f1-41af-91ab-2d7cd011db47&experience=power-bi


- **Feedback will help Brain learn.** In the future, automated actions such as customer notifications will also provide system feedback. This feedback will help Brain learn and optimize future responses. 

### Next steps
- Find out [what problems Brain solves](xref:problems-solved)! 
- [Get started with Brain.](xref:get-started-with-brain)
- If you can't find what you're looking for, try [Brain Support](https://aka.ms/brainhelp).


<!---------------------------------------------------------------------------------->
[!include[Footer](~/footer-common.md)]
<!---------------------------------------------------------------------------------->