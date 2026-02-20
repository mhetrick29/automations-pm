Supporting custom detection scopes in the Brain product

Epic:

# Overview

## Elevator Pitch / Narrative

Brain today supports region-level detection, but this does not align with how many services are architected and monitored in practice. While we have used various workarounds (i.e. non-standard regions) to support detection at other scopes such as scale units, these workarounds do not support all Brain functionality (especially Autotriage) and are difficult to configure and maintain. Adding support for additional detection scopes will enable a self-service experience for service teams, eliminate Brain team work to create and maintain workarounds for detecting at other scopes, and unblock Autotriage and other Brain scenarios.

For this document, we’ll use the term “scope” to mean any specific aggregation of data that some entity cares about monitoring or following. This entity could be a service, a downstream system like deployment checks, etc. For example, a user could choose to monitor the “region” scope and Brain would make monitoring decisions per region, or Azure OpenAI could monitor the “OpenAIModelName” scope and Brain would make monitoring decisions per OpenAIModelName.

Previous exploration in this area:

Previous eng design doc: Brain 2 - Enhanced Location Id Support.docx

Manual Scale unit support for App Services Scale Unit level detection for App Service to Improve Brain.docx

Standard location ID definition: Location Identifiers - Standards Proposal.docx

Recent explorations: Guidelines of SLIs for Brain Scenarios.docx, Brain Detection at Different Scopes-ELID and Dimensions.docx, EB detection at Custom Scope to Improve Brain.docx

## Customers / Users

The users for this feature are Service owners and DRIs of services using Brain to detect outages at something beside region level granularity and who want to be able to leverage other Brain functionality such as Brain Autotriage.

## Customer Problems and Insights

When Brain does not support detection at the right granularity for a given service it can lead to the following problems:

Brain is unable to detect some service outages, reducing Brain Coverage and usefulness for that service.

Increased support load for Brain team to work with service teams to create custom detection workarounds.

Proliferation of SLIs. Some services have created separate SLIs for dimensions such as product SKU (i.e. one SLI for free SKU, another for paid SKU, etc.). This approach is not feasible when detecting outages using multiple dimensions is needed. For example, the Business and Industry Copilot team (BIC) has a need to track service availability across ten application names, two traffic types, and three service types, which would require 60 SLIs if each possible combination were modeled using a unique SLI.

Some Brain functionality, especially Autotriage and Brain Cloud Health, may not function for services where they have tried to workaround this missing functionality by replacing standard regional location information with their custom detection information such as scale unit, etc.

No support for scale unit (or general unit of deployment) for deployment health and rollbacks.

No way to view the health of scale units or other logical hierarchy locations below region level, i.e. zone, SKU, scale unit, cluster, etc.).

There are four main types of unsupported detection scenarios today:

Scale Unit & Cluster – Many services (e.g. App Service, Azure DevOps, XStore, Service Bus, MDM, and OneDrive Sharepoint) are built so that customers are impacted if a single scale unit or cluster goes down. Detecting issues only at the regional level can miss customer-impacting outages that affect only a single scale unit or cluster.

Availability Zone – Services deployed across Availability Zones (e.g. Logic Apps, Redis Cache) want Brain to create zone-level incidents. If one availability zone for a service goes down, Brain should alert the service team even if other zones in the region are still up and customers may not yet have been impacted.

Global Services – Some services are “global” and dynamically route customer requests to resources in any Azure region. These services, such as Azure DNS, Traffic Manager, and Azure Front Door need Brain to detect outages that span single regions (e.g. global network or cross-region failures).

Custom Dimensions – Some services, such as Azure OpenAI, Azure Log Analytics, and Service Bus need Brain to detect outages using service-specific dimensions like models, tables, product SKUs, and deployment rings.

Multi-dimensional anomaly detection- Some services want Brain to detect over any permutation of the dimensions or locations they emit in the SLI signal to optimally detect customer-impacting issues. We will not fully address this in this document but will propose a solution that can be extended in the future.

# Goals & Features

## Goals

| No. | Goal | Priority |
| --- | --- | --- |
| 1 | Improve Brain Coverage for services that need to detect outages outside region granularity | P0 |
| 2 | Brain team do not need to do custom work to support services that need to detect outages outside region granularity | P0 |
| 3 | Service teams can use deployment health check to roll back per-scope deployments in a generalized way. | P0 |
| 4 | Service teams can detect outages at the right granularity while also following the Location ID standard. | P0 |
| 5 | Brain Autotriage and Brain Cloud Health are supported for services that follow the Location ID standard, even when services have configured Brain to detect outages at scopes besides region. | P0 |

Note: This should work for all Brain detection models and all SLI categories.

## Non-Goals

| No. | Non-Goal |
| --- | --- |
| 1 | Define Brain Cloud Health experience to view scale unit or logical hierarchy health for a service (will be addressed in a subsequent spec). |
| 2 | Add support for non-Azure LocationID schemas (i.e. Autopilot or Edge sites) |
| 3 | Add cross-region correlation (ie all scale units across all regions in a service are correlated) |
| 4 | Define how new Brain detection models roll out relative to scope support |
| 5 | Design an experience for solving Brain automatically turning on outage declaration or customer comms (customer vs service centric SLIs) |

# Feature Design

## Data Inputs

Brain will support LocationID segments and custom SLI dimensions as scopes. The below table summarizes how Brain will use these dimensions to support scopes:

| Property | Description | Example Data | Supported by Brain? |
| --- | --- | --- | --- |
| Physical zone | The physical zone for a given resource. | Ms-loc://az/{cloud }/{region}/AZ01 | Yes |
| SI (Service instance identifier) | A hierarchical chain of key value pairs to represent fine-grained service structure. SI always begins with Service Tree ID, but may include stamp, scaleUnit, cluster, env, etc. as needed to uniquely identify a service instance. This should map to the unit of deployment for the service. | Ms-loc://env/public/region/AZ01?SI=/stid/df36aee8-c644-400b-a0ab-fd0f1191211d/role/GeoMaster/env/ASE1/stamp/Stamp1 | Yes* *Brain will not parse the SI. We may explore this in the future |
| Ext | For user to pass in user and service specific metadata. This field could have any custom service-specific location information. | ?Ext=/key1/val1/key2/val2 | No |
| Custom Dimension | Use to represent any custom aggregation of the SLI data upon which Brain should perform health & detection. Brain will not take any hierarchical information from this. | Additional SLI dimension, ie “OpenAIModelName/o3-mini” | Yes |

### Location ID Standard

The Location ID standard has two required properties for Azure services: the cloud and region. In addition to these standard properties, Brain should add support for the following optional SLI LocationID properties:

Hierarchy: Since cloud, region, and physical zone are defined in a hierarchy per the LocationID standard, each of these fields should be addressable only in the context of that hierarchy. For example, “LocationID - cloud”, “LocationID - cloud/region”, and “LocationID - cloud/region/Physical zone”, or “LocationID - cloud/region/Physical zone?SI=…”.

SI: We will begin by addressing the SI field as a single “magic string. In the future, we will look to extend this to understand additional granularity in the SI field that adheres to the hierarchical key/value pair definition of SI. In the example in the above table, the only four addressable values would be “LocationID - SI=stid”, “LocationID - SI=stid/role”, “LocationID - SI=stid/role/env”, and “LocationID - SI=stid/role/env/stamp”.

Ext: Brain will not support scopes based on the ext location parameter.

### Nonstandard location

Nonstandard location will be supported as a single string for which health & detection can be performed (ie the scope will be “LocationID”). Brain will not recognize or understand the meaning of a nonstandard LocationID (ie if a service emits a scale unit as the location outside of the standard, Brain will not recognize that as a scale unit). However, Brain will support the entire LocationID field as an addressable scope (ie the scope will be “LocationID”) to ensure continued support SLIs that currently have nonstandard LocationID due to Brain’s current limitations (such as some services emitting scale unit as the LID).

### Custom dimensions

In addition to data present in LocationID, service owners can specify custom dimensions in their SLI to enable detection on scopes such as model, table, product SKU, traffic type, etc. Each custom dimension should be addressable by the name of the dimension (e.g. “Model”, “TrafficType”, etc.).

### Data Cardinality

Brain only supports custom dimensions and optional property keys with 10,000 or fewer values to protect product performance and reliability. Once data cardinality for a given custom dimension or optional property key (i.e. LocationID - SI=scaleunit” or “Model”, etc.) exceeds this number Brain should not calculate health nor make that field available to be included in a Brain SLI monitor detection scope definition.

## Product Experience

Vision: When a service onboards to Brain, Brain intelligently determines the best scopes for which to calculate health, perform detection, and take intelligent actions (such as outage declaration & comms). Brain creates a health model of the relationship between those scopes. Users can edit this with natural language as desired.

Each Brain monitor should allow the service owner to configure one or more scopes that should be used for health calculation and detection. Brain should evaluate each detection scope separately, i.e. if there is a regional scope and a scale unit scope and the Brain SLI monitor is enabled for outage detection then Brain could potentially declare outages for either scope.

Each detection scope consists of one or more data keys / fields (as described above). Example detection scopes for a single Brain SLI monitor:

| Scenario | Example | Notes |
| --- | --- | --- |
| Global detection | Cloud (LocationID- ms-loc://az/cloud/global) |  |
| Regional detection | Region (LocationID- ms-loc://az/cloud/region) | Default for new SLIs |
| Availability zone | Region (LocationID- ms-loc://az/cloud/region/physicalzone) |  |
| Scale unit | Scale Unit (LocationID- ms-loc://az/cloud/region?SI=<scale unit>) |  |
| Non-standard location | Nonstandard Location (i.e. prodCluster01) | To support existing SLI monitors with non-standard Location IDs. |
| Custom Dimension | Ex: OpenAIModelName | Assumes OpenAIModelName is available in a custom dimension |

### Where we are today

| Capability | Detection- EB (SR/Availability) | Detection- Resource Health (All SLI cats.) | Detection- Multi signal models | Declare outage | Send auto comms | Visualize health in BCH | Check deployments |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Supported scopes | Region, Nonstandard | Region, Nonstandard | Region, Nonstandard | Region, Nonstandard | Region | Region | Region |

*Capability in pilot

Detection (Anomaly & Incident):

Customers can currently get detection at the region or the entire LocationID string.

For these scopes, Brain currently supports 3 types of anomaly detection models:

Error Budget (num/denom based) (for success rate and availability SLI categories) which aggregates the num/denom values across all resources per LocationID. Traffic volume follows a similar data aggregation pattern.

Health-based (for success rate, availability, and latency SLI categories) which calculates the health per resources and then aggregates the unhealthy resource count per LocationID

[Pilot] Multi-signal modes like OPM, which uses pattern analysis across all signals for a service.

Declare outage & send Auto-Comms:

Services can declare outages at region or nonstandard LocationID level.

The outage declaration decision is based on aggregating the unhealthy resource count at the region or the nonstandard location level.

If Brain can look up the region (which for regional detection is intrinsic), Brain can send comms.

Visualize Health: Services can visualize health per service and per region

Check Deployments: Services can check deployment health & integrate rollbacks at a region level (some custom work has been done for specific services like ADO and App Services).

Incident Experience:

Brain Autotriage is supported for all SLIs with a standard LocationID value (i.e. at least cloud and region are specified), regardless of the detection scopes specified and whether optional LocationID or other custom fields are included.

Configuration: Actions (create incident, declare outage, send comms, etc) are configured at the single-SLI monitor level. Brain currently always aggregates data based on LocationID (region or nonstandard).

### Phase 1- Support for EB detection at new scopes

Summary: Brain will extend support for detection beyond region and entire LocationID string to sub-regional and SI LocationID segments and custom SLI dimensions, specifically using EB. Customers can enable outage declaration and auto-comms when outages are detected for these scopes. Detection using resource health models for (success rate, availability, and latency), health views, and deployment checks are not yet available. Outages will be correlated per service per region and only for incidents with a single region.

| Capability | Detection- EB (SR/Availability) | Detection- Resource Health (All SLI cats.) | Detection- Multi signal models | Declare outage | Send auto comms | Visualize health in BCH | Check deployments |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Supported scopes | Region, Nonstandard, Zone, SI-full string, Custom Dimension | Region, Nonstandard | Region, Nonstandard | Region, Nonstandard, Zone, SI-full string, Custom Dimension | Region Zone*, SI- full string*, Custom Dimension* | Region | Region |

*Region information must be present to send comms

Detection: Customers will continue to get support as described for today for detection at the generic LocationID level and region level.

Brain will then add support for recognizing additional scopes of Zone, SI, and custom dimension for aggregating SLI data leveraging the EB model.

Visualize Health: Services will continue to visualize health per service and per region, but health views for scopes beyond region are not available in Phase 1.

Existing BCH views should not have any change to the logic used to calculate and display health, regardless of detection scope or which optional LocationID fields may be included in a SLI. In the future we will add BCH health views for the additional scopes users select.

Check Deployments: Not available for scopes beyond region in Phase 1 since it depends on resource health calculation.

Declare outage & send Auto-Comms: Brain will continue to support declaring outages and sending comms at the regional level and for nonstandard location.

Brain will add support for declaring outages and sending comms for scopes of Zone, SI, and custom dimensions, but can only send comms when region information is present.

Incident Experience:

IcM and Incident Explorer: Incident detail views (including AskBrain) should show data specific to the detection scope for a given incident. For example, if an outage is declared at the scale unit level, the SLI charts shown in IcM impact view, Brain incident explorer, and/or BCH incident detail views should be specific to the scale unit for which the outage was declared.

For outages that affect multiple regions, Brain will populate the “impacted regions” field in IcM.

For sub-regional outages, Brain will include both the scope and the region in the title (ie Brain has detected… in ScaleUnit 1 in EastUS).

For custom dimension outages, Brain will only include the custom dimension in the title.

Correlation: Brain will not change any correlation behavior initially; that can be explored in a future feature. Brain will correlate per service per region. Brain will not correlate outages detected for custom dimensions (i.e. if AOAI has 2 different models with outages, or if a model and a region each have an outage, they will stay separate).

Configuration: Scopes will be configured via config as code for Phase 1. There will not be a UX element for selecting scopes by the customer.

#### Migrating Existing Brain SLI Monitors

Brain will enable “scopes” for existing Brain monitors. The following should serve as a translation for what scope is supported based on the current Location ID:

| Current Location ID / Configuration | Example | Default Scope |
| --- | --- | --- |
| Standard LocationID | LocationID = ms-loc://az/public/eastus | Region |
| Non-standard LocationID | LocationID = waws-prod-am2-665 | Whole LocationID |
| Services with existing scale unit support (App Service, DevOps, etc.) | LocationID = ms-loc://az/public/eastus?si=/serviceinstances/waws-prod-am2-665 | Scale unit |

#### Edge cases/notes:

Users will not be able to create incidents of different severities per scope

This assumes that the data is available for Brain to parse. This should be a safe assumption given the product should not onboard services with low quality scores (meaning there is enough data to generate a quality score).

#### Userflow: Onboarding

#### Post-Onboarding Lifecycle Actions

| Action | Flow |
| --- | --- |
| Auto-Promotion | Brain will auto-promote at the monitor level. |
| Remove a scope | If a user updates the SLI and removes a scope that is enabled, Brain should recognize that change, disable the scope for detection (even if that is the only scope enabled for the monitor), and notify the customer. |
| Add a scope | If a user updates the SLI and adds a scope, Brain should recognize that and notify the user that a new scope has been added and can be enabled for detection. |

### Phase 2- Support for resource health model-based detection and deployment rollbacks, user-friendly configuration, and parsed-SI

Summary: Brain will now support resource-health-based models for scopes beyond region & full Location ID string. This enables Brain detection for all currently-supported SLI categories (success rate, availability, and latency). Brain will now also parse the SI field to permit different scopes underneath the SI field. Brain will also now support deployment checks for additional scopes.

| Capability | Detection- EB (SR/Availability) | Detection- Resource Health (All SLI cats.) | Detection- Multi signal models | Declare outage | Send auto comms | Visualize health in BCH | Check deployments |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Supported scopes | Region, Nonstandard, Zone, SI-any K/V pair, Custom Dimension | Region, Nonstandard, Zone, SI-any K/V pair, Custom Dimension | Region Nonstandard LID | Region, Nonstandard, Zone, SI-any K/V pair, Custom Dimension | Region Zone*, SI-any K/V pair*, Custom Dimension* | Region, Zone, Zone, SI-any K/V pair, Custom Dimension | Region, Zone, SI-any K/V pair, Custom Dimension |

*Region information must be present to send comms

Detection: Customers will now get support for all scopes using EB and health-based detection models. This enables detection for latency SLI category.

Brain will now also parse the SI field to allow selecting scopes within the SI. For example, if the location is Ms-loc://env/public/region/AZ01?SI=/stid/df36aee8-c644-400b-a0ab-fd0f1191211d/role/GeoMaster/env/ASE1/stamp/Stamp1, the scopes available to the service would now include region, zone, stid, stid/role, stid/role/env, and stid/role/env/stamp.

The reason for including this in phase 2 is 4 different customers (MDM, FPSS, BIC, and Identity storage) have indicated that they need different capabilities at multiple levels in their SI and would have to split those into custom dimensions for the time Brain cannot parse the SI. For example, MDM needs detection at the stamp level but would do deployment rollbacks at a stamp/color level. They would have to split out one of these into a custom dimension until Brain could parse the SI. This would lead to increased SLI volume and introduce tech debt on services for whenever Brain is able to parse the SLI (they would need to re-emit the Location ID with the full SI and delete the custom dimension).

Once services start using custom dimensions to work around SI parsing gaps, it may become a permanent precedent. To avoid thus churn as much as possible, we will parse the SI hierarchy in phase 2.

Visualize Health: No change

Check Deployments: Deployment Health should also now be available leveraging any scopes in the SI field when selected as a scope in the UX.

Incident Experience: No change

Declare outage & send Auto-Comms: This support remains the same as Phase 1.

Configuration: We will provide a configuration experience to select detection scopes per monitor.

### Phase 3+

We will consider more things in the future such as

Health views:

Support visualizing health at all scopes

More deeply support Brain creating relationships between scopes (probably with a dynamic health model) and hierarchies of scopes

Detection:

Parsed SI field to allow users to configure detection at sub-scopes in the service instance to allow additional flexibility specifically beyond Azure

Multi-scope detection (ie look at SKU and region for problems)

More intelligently define the default scopes (maybe using a top-down agentic approach like Brain zero)

Multiple-signal models using scopes (like the new OPM/ODM discussions)

More deeply scoped health & detection for service-centric SLIs

Incident Experience:

Correlate across scopes

Include information about scopes for the SLI signal that are not the scope for the detected incident as enrichment. For example, Brain may detect a regional outage, but if the SLI includes an API dimension, Brain can include the APIs associated with the impacted CRIDs

Configuration:

Leverage more natural language to configure if scopes can be used for outages/comms (ie if the service is “regionally available” then zones are an indeterministic scope)

The configuration experience extends in this phase to include the ability to apply the scopes selected for one SLI to another SLI (ie set region and scale unit for SLI A, I can just copy and paste that into SLI B,C,D…)

Improved UX for defining scopes per service that live independently of Brain monitors such that they can be applied to different types of brain monitors that are not necessarily signal specific (like health topologies visualizations for resource types in MDM)

# Definition of Success

## Success Metrics

Guidance: How will success be measured? What Key Results might be used to measure the business, customer, and technology outcomes you are hoping to achieve. Priority: P1 = Must Have, P2 = Should Have, P3 = Nice to Have

| No. | Type  (Biz, Cust, Tech) | Outcome | Metric | Pri |
| --- | --- | --- | --- | --- |
| 1 |  |  | X% precision for scoped Brain detections |  |
| 2 |  |  | Y BCH quality score for non-regional health visualizations |  |
| 3 |  |  | Z triage accuracy for non-regional detections |  |
| 4 |  |  | <A% of users request help when configuring non-regional Brain capabilities |  |

** Send out a survey to Brain management support team (Brain PMs, ML and core engineers) at the end of Dt to gauge support pain. Resend survey during and after Se to gauge perceived pain improvement.

## [TBD] Contributing Teams / Collaborators

Guidance: At a high level, what teams need to collaborate on which requirements to complete the epic?

| No. | Requirement or Deliverable | Producing Team |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

## Dependencies

| No. | Requirement or Deliverable | Producing Team |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

# Appendix

## Why this user experience

The overarching question is how does Brain empower service teams to author SLIs for which Brain can accurately determine health and detect problems for the scopes that they care about?

The product experience that answers this question has 2 parts:

What does Brain need to know

How does the service convey that information to Brain

#### What Brain needs to know

Brain needs to know:

Is the signal customer-centric (measure customer problems) or service-centric (measure problems in the service infrastructure)?

If the SLI is customer-centric, which scopes within that SLI signal give a full picture of the customer experience?

Are these scopes related in any meaningful way?

Is the signal customer or service centric is essential for Brain to accurately determine health and customer impact, as service-centric SLIs will not be used for customer-impact dependent capabilities (no outage & comms). More details & examples included in the Appendix

Which scopes within the SLI signal give a full picture is essential because not all scopes in a customer-centric SLI will include a full set of information for Brain to determine health & customer impact, as customer-centric SLIs by definition will not include failures that were handled internally & successfully handled from the customer’s POV. We also don’t want to limit the scopes services can emit in a customer centric SLI, as services have expressed a keen interest in enriching an with context when an issue is detected (like which SKUs or clusters are associated with the unhealthy resources). Therefore, we need to know which scopes in the SLI can be used to accurately determine health and customer impact. More details & examples included in the Appendix.

Are the scopes related in any meaningful way is something Brain needs to know to accurately create a hierarchy or relationship between scopes. LID is defined as a hierarchy, but there is no such standard for the relationship between LID-contained scopes and custom dimensions.

However, introducing these relationships (beyond the inferred hierarchy of the location ID) introduces much complexity with calculating rollup health or many:many relationships of CRID:any custom dimension. We will explore more deeply in future iterations of this work, as the problems in the introduction sections do not specifically require any sort of hierarchy or relationship between scopes to be established.

For incidents detected for a specific scope, we will start by automatically including information for all scopes defined in the SLI as enrichment in the detection. Over time we will more intelligently include scopes by learning the patterns of the signal and leveraging the relationships between scopes.

#### How do customers convey this information to Brain?

A service should only indicate which scopes Brain should look at to calculate customer impact, declare outages, & send comms for a given SLI. To ensure customers select the right thing without exposing these internal concepts to them, the tested design principle of a “fill in the blank” style configuration will allow users to easily tell this to Brain, something like “Brain should declare outages and send comms when it detects issues at the {insert scopes} level”.

It should also be clear in the experience that these are the scopes that are eligible for outage & comms; Brain will not take those actions until the signal is of high quality.

If any scope is selected for outage & comms, then the SLI is customer-centric, since we will not support outage & comms for service-centric SLIs. This should be made clear in the experience.

An SLI with no scopes selected for customer impact/outage declaration/comms will be inferred to be service centric.

As a stretch, a service should be able to indicate if there are any other scopes Brain should monitor without declaring outages or sending comms with the clear understanding that these scopes will only be used for incident alerting.

### Other experience considerations

#### Customer scenarios

| Scenario | Recommendation |
| --- | --- |
| [Service wants to include some scope only for enrichment] A zonally redundant service should not experience customer impact when a zone goes down, but services may still want to know which zones saw the failures to accelerate restoration of data redundancy. | The service should emit a customer-centric SLI and select the region scope for customer impact/outages/comms. |
| [Multiple scopes in the SLI all should be used for outages] A non-zonally redundant service would experience customer impact when a zone goes down and if there is an issue in a region, and they want outages for both scenarios. | There should be 1 customer centric SLI with location down to the zone. Select region and zone as outage scopes. |
| [Some scopes are not outages but could be good leading indicators] For some services like Xstore, customers may experience an outage when a specific scale unit or stamp containing their data goes down. A general degradation in a region may not actually indicate a customer outage (if no single scale unit or stamp goes down) but service teams may also like to get early warnings in this case with the understanding that the data may not be perfect. | Emit 1 customer-centric SLI down to the scale unit. Select scale unit as the outage scope, and select region as another scope Brain should monitor but not necessarily declare outages. |
| [Leading indicator for a customer-centric SLI] A zonally redundant service may still want an alert when Brain detects a volume drop in a certain zone, which could indicate a growing problem, to accelerate investigation and prevent a potential outage. | Brain will not support this case via a customer centric SLI since the zone is not a customer concept; the service should create a service-centric SLI to monitor this scenario and get that leading indicator. |

*This is a separate discussion (what is Brain-calculated customer impact and is it always an outage); we will ignore this here and assume customer impact is not always an outage

#### Monitor decisions

For each SLI, Brain will take the following actions:

|  | Incident Creation | BCH | Auto Severity upgrade | AOD | Auto Comms | Auto Triage | DHC | Resource Health |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Customer-centric SLI | Y | Y | Y | Y | Y | Y | Y | Y |
| Service-centric SLI | Y | Y | Y | N | N | Y | Y | Y |

## Ext treatment

Service owners should be able to address each key in the Ext field separately. For example, both “Location ID - Ext=key1” and “Location ID - Ext=key2” from the example in the above table would be addressable separately. Since “Ext” is not defined as a hierarchy in the LocationID standard Brain will make each Ext key addressable independently.

## Supporting Data

What the data point to is that services have many different requirements for what they want to include in the LID and what they expect from Brain for optimal performance. This really comes down to 2 scenarios:

I want Brain to use a single scope per SLI, and I will codify that in the SLI. Each SLI may represent different scopes pertaining to the same scenario (ie call success rate per region, per cluster, per customer, etc.) (Ex: NetApp Files)

I want Brain to use multiple scopes per SLI, and I will codify that in the SLI. I want alerts per scope, and I may even want alerts using multiple scope. (Ex: BIC)

### Why is this a problem?:

Missed coverage opportunity: Customers need to perform detection at non-regional levels to achieve optimal value from Brain. Often regions do not provide the granularity needed to achieve optimal Brain detection coverage or optimally model health for the service. This means customers cannot achieve value from Brain, impacting Brain’s effectiveness.

No standard: Customers have attempted to implement workarounds for this by emitting nonstandard LIDs. This leads to quality concerns in the Brain system with handling random strings. (evidence?)

High cardinality: To effectively monitor BIC service right now, they mentioned each of these metrics would require multiple SLO definitions for every combination of application name, traffic type (synthetic vs. real), and service type. For instance, if an organization tracks 10 applications, each with two traffic types and three service categories (e.g., API, batch, UI), the total number of SLOs required would be: 10 applications × 2 traffic types × 3 service categories = 60 SLOs per metric. Having some way for Brain to support custom dimensions would allow this to be 1 SLO

Increased support load: Some services are currently scrappily supported for scale unit as a workaround: App Service, AzDev, ODSP. Other customers see this and emit their own nonstandard LIDs and then escalate support requests, or in some cases even incidents (Sev1 incident detected by Brain where the user could not view health and was concerned Brain was broken).

More new scopes every few months: In the last week alone, hi pri asks coming in to support other location granularities from OpenAI (support model-level detection), FPSS (service instance level detection). This is not the first time asks like these have come in hot.

Limited scalability: Non-Azure services may not even have the concept of a region for how they deploy and monitor their service. BIC identified multiple levels that are important to effectively managing their service, ie a LID something like Ms-loc://az/cloudType/RegionName?si=/app/ApplicationScope/clustercategory/ClusterCategoryName/clustertype/ClusterTypeName/station/S1/geo/geoName/island/islandNumber

Other services doesn't have region concept , therefore they are emitting something else (AFD : Global , PKI : OneCert).

Additional user insights:

NetApp files provided some key insights into their desire:

They would implement one SLI per scope: At the moment we'd probably tune them, like we'd write a different KQLN query based on it being a cluster versus a region, so we'd alter the query entirely. So having the ability to have a different KQLN query probably would help that. But also this notion of linking KQLM queries and and the KQLM query being able to look outside itself as well. So maybe look at some other Kusto data that we could that we could expand the insight that we have. Within the KQLM itself, at the moment, the KQLM is only looking at the streaming metric, so being able to add nuance to that would be helpful. And we're trying to do that at the moment with the next phases of getting rid of this -1. We're trying to do that by adding a dimension that gives us some nuanced information that we're going to add into our KQLM today. That's our current thinking.

They want non-location scopes: Probably the customer dimension would actually be helpful as well to know that this is coming from, you know, for a particular customer because. You know, if for example, you know we we might have 5 let's say or even 20 volumes that are offline, but if those 20 volumes are for 20 different customers, it's actually, I shouldn't say it, but probably not that big a deal. I mean it might be if they're all in a single cluster, then you know we'd want to know that that's a cluster thing. We need to go and investigate that. But if, for example, it's 20 volumes and they're all for a single customer, then that's a big deal and we need to really respond quickly and we potentially want a different way of seeing those too.

Users should also be able to add/remove scopes from incident alerting and outage declaration fields

Examples of service teams desiring a parsed SI:

Niranjan Upreti: LocationId | Brain Product Support > Brain Support | Microsoft Teams

BIC identified multiple levels that are important to effectively managing their service, ie a LID something like Ms-loc://az/cloudType/RegionName?si=/app/ApplicationScope/clustercategory/ClusterCategoryName/clustertype/ClusterTypeName/station/S1/geo/geoName/island/islandNumber

Customers receive insufficient detection granularities

QCS++ requiring sub-regional detection for performance: App services, NRP, AzDev , Xstore

QCS++ requiring non-regional detection for performance:

# services requiring scale unit detection:

Services requesting but not mandating (yet): Entire Dynamics org

Customers have issues with validating & updating their location IDs (no feedback loop in product today). Only computed for QCS today

QCS SLIs following standard: 136

QCS SLIs not following standard: 891

QCS Services with some SLIs following standard and some not: 10

#QCS with noncompliant LID but can map region:

#QCS with noncompliant LID with no mapping available:

## More information about what Brain needs to know

### Is the signal intended to measure customer problems or measure problems in the service infrastructure?

Brain needs to know if an SLI is service-centric or customer-centric to accurately calculate health and determine customer impact; the explanation of why is detailed in Guidelines of SLIs for Brain Scenarios.docx:

A customer-centric SLI means the failure calculated in the SLI signal is felt by the customer. This SLI is deterministic of customer impact.

As a very basic example, for a “call success rate SLI”, a specific CRID could measure 100 calls in a specific evaluation window. If 98 succeed, the SLI will emit 98 as the numerator, 100 as the denominator, and a success rate of 98%. In this case, the 2 failed calls must be felt by the owner of that CRID for this SLI to be customer centric. Therefore, this SLI is deterministic of customer impact.

For an above-ARM resource, this would typically by 1:1 CRID:result in the data. However this would not always be the case, for example resources deployed across multiple stamps, so we would need to work to understand a more apt proxy to handle all scenarios.

A service-centric SLI means not all failures measured by this SLI might have been felt by the customer. This SLI is not deterministic of customer impact because Brain does not know how to calculate a failure for this resource since there are multiple data points for this resource and Brain cannot infer how to aggregate them.

Using the call success rate example above, if SLI would show a call fails in zone 1 and succeeds in zone 2, this SLI would have 2 records for this 1 CRID. Brain does not know if a failure means 1 call failed or both failed.

I.e. the data looks like <CRID A><ms-loc:/…eastUS/zone 1>==fail and <CRID A><ms-loc:/…eastUS/zone 2>==success. Brain cannot accurately do detection & comms in this scenario since we do not know how to accurately aggregate these 2 results for 1 CRID. Therefore the SLI is not deterministic of customer impact.

A customer-centric SLI in this case would only emit a row from zone 2.

### For what levels of aggregation (scopes) can Brain calculate customer impact to declare outages & send customer communications?

Related but tangential to customer vs service-centric SLIs is the idea that individual scopes for a customer-centric SLI may or may not be definitively indicate a customer problem. Service-centric SLIs are only ever non-definitively impacting as Brain cannot deterministically measure customer impact. We will call these “deterministic” and “indeterministic” scopes. Note that the word “deterministic” can be confusing, so users will configure if a scope is “deterministic” by selecting if health issues are “definitely” or “not necessarily” customer problems. See the user experience section.

For simplicity, let’s use our regionally-available, zonally-redundant service, and say this service emits a customer-centric SLI for call success rate down to zone (ms-loc://az/public/region/zone), and let’s say eastUS has 2 zones.

If zone 1 in EastUS has issues but zone 2 is fine, then requests would fail in zone 1 but retry and succeed in zone 2. This means a customer would never actually experience a failure and therefore the SLI signal would not include any of the failed requests. This is the SLI author’s responsibility.

In this case, Brain cannot deterministically say anything about the zones since the SLI does not all of the data for the zones (it does not include the initial failures).

However, if a bunch of failures start popping up in zone 2, then these would show up in the SLI signal. We would then detect issues in zone2 and eastUS (and maybe zone 1). Since these are all failures, the issue detected with eastUS and zone 2 would definitively mean a customer is impacted.

In this case, due to the redundancy of the service, Brain-calculated health for zones is unreliable and Brain-detected issues at the zone level may or may indicate a customer problem. However, Brain-calculated health and Brain detections at the region level definitively indicate a customer problem.

In addition to location data, customers can emit separate custom dimensions, and these can follow either pattern described above depending on the type of custom dimension. For example, typically a SKU is shared amongst various resources vs one resource being spread across multiple SKUs, a stamp or cluster could serve one resource, or an OpenAI model could be 1:1 with a resource.

Ultimately, a customer-centric SLI can include scopes that both definitive and non-definitively indicate a customer problem depending on service redundancy or which pattern a customer dimension follows. Brain cannot infer this information and needs the service to provide it.
