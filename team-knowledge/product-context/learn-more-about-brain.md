---
uid: learn-more-about-brain
title: Learn more about Brain
---
<!---
Shortlink: none
Status: completed
Open items: 
Type: reference
Audience: anyone wanting to know more about brain, mostly service owners/our internal customers
Learning objective: understand more about what brain does at a high level and how the capabilities work together
Incoming links: 
--->

# How Brain works

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

If you can't find what you're looking for, try [Brain Support](https://aka.ms/brainhelp).

<!---
Do not edit *anything* below this comment.
--->
<!---------------------------------------------------------------------------------->
[!include[Footer](~/footer-common.md)]
<!---------------------------------------------------------------------------------->
