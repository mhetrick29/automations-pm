---

uid: brain-glossary
title: Brain glossary

---

<!--
Shortlink: none
Status: draft
Open items:
Type: glossary
Audience: service owners, anyone who wants to know what Brain can do for Azure
Learning objective: Understand common Brain terminology
Incoming links:
-->

# Glossary

| Term | Acronym | Description |
|------|---------|-------------|
| Azure incident manager | AIM | Coordinates incident response |
| Azure Resource Graph | ARG | Tool for querying Azure resources |
| Azure Resource Manager | ARM | Azure deployment and access control service |
| Brain | — | Internal Microsoft system for outage management |
| Brain-integrated monitor, Brain-integrated service monitor | — | Geneva (MDM) or other service monitor that is set up to report unhealthy resources to Brain. With a Brain-integrated monitor, the service performs anomaly detection and sends the information to Brain to do impact assessment. In contrast, with Brain monitors Brain performs both detection and impact assessment.  |
| Brain monitor | — | Checks service signals, specifically in the current case Service Level Indicators (SLIs). With Brain monitors, Brain performs both detection and impact assessment. In contrast, with a service monitor integrated with Brain, the service does the detection and sends the information to Brain to do impact assessment. |
| Communication Manager | CM | Manages internal and external communications during incidents |
| Designated Responsible Individual | DRI | Handles live site incidents |
| Incident Management | IcM | Microsoft incident management system |
| outage | — | Outages are incidents that require collaboration across many services or result in customer impact. Different products and teams might define outages differently depending on their Service Level Agreement (SLA), customer expectations, or other criteria. A general rule of thumb is an incident resulting in customer impact should be treated as an outage. Brain SLI-based outage detection uses a default of an issue that impacts 50 resources and lasts for 10 minutes, the definition of a [High Impact Outage](https://eng.ms/docs/products/icm/reporting/outage-definition#high-impact-outages). |
| Resource Health Check | RHC | Interface for checking Azure resource health |
| Service Level Indicator | SLI | Quantitative measure of service performance |
| Service Level Objective | SLO | Target performance range for SLIs |
| SLO YAML | — | Format for defining SLOs and SLIs |
<!-- -------------------------------------------------------------------------------- -->
[!include[Footer](~/footer-common.md)]
<!-- -------------------------------------------------------------------------------- -->