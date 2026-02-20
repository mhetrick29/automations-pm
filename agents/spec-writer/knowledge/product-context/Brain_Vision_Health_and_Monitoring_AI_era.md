Brain Vision:  Health and Monitoring system reimagined in the AI era

Jun 2024. Draft

# Summary

The mission of Brain, Microsoft’s AIOps health and monitoring system, is to significantly improve service reliability by preventing outages from occurring, minimize customer impact caused by outages when they inevitably happen, and reduce human toil.

As AIOps, GenAI, and ML technology rapidly advance, simply integrating AI/ML into existing systems is insufficient to harness their full potential for service health and monitoring infrastructure. We need to reimagine the system from the ground up with AI at its core. This document outlines the primary design principles and components of Brain and how they synergize to form an AI-driven health and monitoring system.

With this AI system, service developers only need to instrument their services and leaving the rest to Brain. Engineers do not need to manually set up and tune their monitors, as Brain will automatically discover service telemetry data and begin monitoring. When anomalies are detected, rather than creating an alert for each anomalous metric or log, Brain leverages its knowledge of service topology and components to correlate the alerts under unique service health issues. For each issue, Brain conducts automatic triage and diagnosis, and mitigates it if possible. Only if the issue cannot be resolved automatically will the appropriate on-call engineers be notified with organized summary information and clear instructions for resolution.

A GenAI powered intelligence engine and Copilot experience is an integral part of Brain. It continuously learns service domain knowledge from all data sources. It can not only assist on-call engineers by guiding them through service health issue mitigation, but also automatically create and execute mitigation steps. In addition to reducing customer impact caused by service health issues, Brain also predicts future service health issues and triggers appropriate actions to prevent them from happening.

# Problems of Existing Health and monitor systems

Traditional health and monitoring systems face numerous common problems, which include:

Lack of Holistic view: Monitors are often configured to detect breaches in individual metrics or logs. However, when an issue occurs, multiple metrics and logs may display anomalies simultaneously, triggering multiple monitors and creating an alert storm. This overwhelming noise makes it difficult for engineers to understand the situation without a comprehensive view. For instance, if a backend SQL server fails, it could cause business logic APIs and web portals to fail as well, generating alerts for SQL success rates, API error rates, web request error rates, and more. Without understanding the relationships between these alerts, engineers may be misled.

Increasing number of monitors and high noise: As telemetry data volumes grow and services become more complex, the number of monitors has become unmanageable. This results in noise, high management overhead, and increased costs. Existing monitors are often very noisy, and engineers lack the data needed to optimize them effectively.

Complex configuration and tuning: Current monitors largely rely on static rules and thresholds, making it challenging to configure and tune them for low TTD and high precision/recall. For example, a static threshold for API success rate can generate excessive noise during transient dips. Adjusting the threshold or extending the observation window can result in long TTDs or missed detections, making parameter setting a guessing game.

Lack of built-in automation: Most monitoring systems focus on detection and offer limited support for automation tasks such as correlation, triage, diagnosis, outage declaration, impact assessment. Relying solely on downstream systems like incident management for correlation and automation is neither effective nor comprehensive.

Lack of quality measurement and feedback loop: Once a monitor is created, there is no clear measurement of its quality and effectiveness, nor is there a feedback loop for engineers or downstream systems to provide input for improvements.

Lack of self-learning and intelligence: Traditional health and monitoring systems do not have the capability to learn from historical data or adapt based on new information. They do not accumulate knowledge over time to enhance their ability to detect and diagnose issues. This means they cannot autonomously improve their performance or make intelligent decisions without human intervention. For example, if a new pattern of failure emerges, these systems cannot recognize it independently; they require manual updates and reconfiguration to adapt to new conditions, resulting in slower response times and increased workload for engineers.

To address these issues, we are fundamentally rethinking how Brain, an AI health and monitoring system, can evolve the existing systems and revolutionize the infrastructure from the ground up. The following sections first introduce the primary design tenets of Brain and then describe its main components.

# Terminology

Here are some terminologies used in this paper for reference. They are explained in detail in the corresponding sections.

| Term | Definition |
| --- | --- |
| Entity | An entity can be anything from a single resource to a service, a customer workload, or a scale unit, etc. It refers to what is being monitored. |
| Health | Health is how well an entity meets its expected operating goals such as SLO. |
| Health state | Health state reflects the state of health, which could be in the form of discrete states such as Healthy, Unhealthy, Degraded, and Unknown, or continuous health score with confidence levels. |
| Health signal | A time series of health state values. |
| Health metric | Metrics that are used to measure health state of an entity, such as SLI, queue length, request volume, incident data, support ticket, etc. |
| Health model | Health model is a framework that utilizes health metrics to determine the overall health of an entity. The framework could be a graph or an AI model. The output of the Health model is Health signal. |
| Health issue | Health issue is any event or condition that negatively impacts an entity’s health. These issues can arise from a variety of factors and can affect one or more aspects of the entity. |
| Alert | An alert is a notification or signal generated when a predefined rule or an AI-driven system detects a condition or anomaly that requires attention, such as a threshold breach, performance issue, etc. It could be a notification to a human engineer or a signal to another system. |
| Monitor | A monitor is a mechanism that tracks specific conditions and events and triggers alerts when they are met or occur . A monitor could be rule-based or AI-driven. |
| Noise | Noise refers to the false alarms or excessive alerts generated by the monitors. They lead to alert fatigue and can obscure important health issues. |
|  |  |

# Health monitoring vs. telemetry monitoring

Traditional monitoring systems often require users to create independent monitors to evaluate manually defined rules on different telemetries. Unfortunately, these telemetries correspond to various aspects of the services being monitored, and the monitoring system rarely understands the relationship between them. As a result, the alerts created by the monitors are sent to the users with little to no insights, leaving it up to the on-call engineers to correlate these alerts and understand what is truly happening. Instead of these noisy alerts, what users really desire from the monitoring system are the answers to two simple questions –

Is my service healthy?

If not healthy, what caused it?

Brain introduces the concept of Health and Health issue to answer these questions in a simple and concise manner. Brain is shifting traditional telemetry monitoring to health monitoring, providing a smooth integration and migration path for the existing monitors addressing the root of noisy alerts and alert storms.

Health is defined as how well an entity meets its expected operating goals, such as SLO. An entity can be anything from a single resource to a service, a customer workload, or a scale unit, etc. Different scenarios may require different ways of measuring health. Health can be measured in the form of a Health State, such as Healthy, Unhealthy, Degraded, and Unknown, and in the form of a Health Score with confidence level. Here are some examples of different Health types and their definition:

Service health

A service with success rate SLO of 99.99% is considered unhealthy in a region if its success rate is below 99.99% in the last 10 minutes.

A service is unhealthy when > 5% of its customers are experiencing higher latency than usual.

Resource health

A SQL database is considered unhealthy when its request success rate is below 99.9%.

Health issue is any event or condition that negatively impacts an entity’s health. These issues can arise from a variety of factors and can affect one or more aspects of the entity. Examples of Health issues include DC power loss, bad deployment, capacity issue, or code bug, etc. A health issue can impact a service’s availability, success rate, or latency etc.

|  |  |
| --- | --- |

Using traditional telemetry monitoring, a single health issue could lead to many telemetry monitors firing and creating an alert storm for the on-call engineers. When using Brain Health monitoring, only a single alert for the health issue will be raised for the on-call engineer. Details about telemetry anomalies are still easily accessible in an organized fashion when needed, but they will not create noise for the on-call engineers. Health monitoring correlates under Health issue and only sends one alert for the issue, as shown in the diagram above.

![image1.png](Brain_Vision_images/image1.png)

![image2.png](Brain_Vision_images/image2.png)

Health itself can be exposed as a metric - a time series of health states, which we call Health Signal. It can be consumed directly by users to have a holistic view of their services or used as input for other monitors or systems. For instance, deployment system can use a service’s health signal to enforce SDP (Safe Deployment Practices).

Brain can automatically discover the telemetry data that could indicate a potential health issue and include them in the health evaluation. For instance, service SLI data is automatically included as the primary data source when determining a service’s health. Users can also configure the health data sources and how they contribute to health evaluation. The health model is the framework used to evaluate health based on various inputs. The health model can be a manually or automatically defined graph, or an AI model, or a combination of both. In addition to the common telemetry sources, other data sources such as incidents, support tickets, synthetic test results, and dependency can also be used by the health model. This significantly improves precision, recall, and effectiveness of health monitoring. The input to the health model is called Health metric, and the output is Health signal.

Customers of telemetry monitoring system have invested in their monitors for years and gained a certain level of trust and familiarity with the existing monitors. They can be incorporated into the health model such that the alerts can be used as input to the Brain health model. Using Health monitoring, alerts are not always sent to humans. Alerts can be consumed by Brain internally or other systems and only sent to on-call engineers when necessary. This provides a natural integration and migration path for the existing telemetry-based monitors. The health monitoring experience section in Appendix shows an example of how Brain works for Azure SQL service.

# AI Monitor

A monitor is a mechanism that tracks specific conditions and events and triggers alerts when they are met or occur. A monitor could be rule-based or AI-driven. The condition or event it tracks could be an entity becoming unhealthy, some anomalous pattern emerging across telemetries, or a telemetry rule is satisfied. Depending on the type of events or conditions, there are different types of monitors such as:

Health monitor, which triggers when some collection of entities become unhealthy.

Event monitor, which triggers when certain event occurs.

Pattern monitor, which triggers when certain pattern, like sudden spike or drop, happens.

Synthetic monitor, which simulates workload to test certain functionalities.

Traditional monitors require manual operations in their creation, management, and tuning. This approach is no longer scalable in the Cloud and AI era. The Brain AI monitor represents a significant advancement in monitoring technology. The AI monitor is designed to automatically monitor all telemetry without the need for setup and configuration. This dynamic system adapts to the environment by employing adaptive anomaly detection, which is a stark contrast to the static rules that trigger traditional monitors. In addition to the telemetry data, Brain AI monitor also incorporates other data sources, such as synthetics, incidents, support tickets, to improve detection precision and recall and collect feedback to enhance the monitor quality.

Once a telemetry appears in the Observability data pipeline, it will be automatically monitored by Brain AI monitor unless user opts out. This ensures that all telemetries have comprehensive monitoring and frees users from the burden of setting up monitors for new telemetries. AI monitors will not require manual management tasks such as creation, disabling, setting severity, etc. They will be done by the system whenever necessary. For example, if based on human feedback, if specific telemetry is not accurately reflecting service health, that telemetry will be automatically excluded from monitoring. Another example is that the severity of the alert will be based on the urgency or impact of the health issue, rather than a specific telemetry’s anomaly. For an example of the AI monitor experience, please see the appendix section.

The AI monitor tracks multiple telemetry and dimensions simultaneously, offering comprehensive monitoring coverage. Most traditional monitors focus on a particular telemetry without considering the relationship between different telemetries. This leads to precision and recall problems. AI monitor is not constrained by this approach. It looks at all telemetries as a whole and discovers the patterns that are most relevant to a potential health issue. For example, a queue length monitor often triggers when there is a sudden increase of incoming requests. However, there is no need to notify the on-call engineers if there is no impact to the service health unless there is a potential capacity issue. Another example is that all error codes in the success rate SLI are monitored automatically for anomaly even when it is user error. An increase in user errors could be caused by a service health issue.

One of the most notable features of the AI monitor is its continuous tuning and self-learning capability. It learns from feedback and improves over time, ensuring that it remains effective even as the system evolves. Brain AI monitor keeps track of every alert it triggers and automatically collects data around the actions taken and input from other systems and users. These data are used to measure the quality of the monitors and make necessary adjustments to improve it. For example, if a certain pattern triggered alerts are constantly marked as false alarm by on-call engineers, the system learns and reduces or even removes the weight of this pattern.

AI monitor works side by side with traditional rule-based monitors to feed detected anomalies to the health models. It also monitors the health signals generated by the health models and trigger alerts when necessary.

data


![image3.png](Brain_Vision_images/image3.png)


In summary, the AI monitor is an intelligent, self-sufficient system that provides comprehensive and accurate detection for the monitored environment. Its automatic and adaptive nature reduces the need for manual intervention, making it an invaluable tool to monitor complex and large-scale cloud services. The table below summarizes the comparison results between traditional monitors and AI monitors.

![image4.png](Brain_Vision_images/image4.png)



# Intelligent automation: AI powered Actions

Intelligent Automation is the catalyst that makes AIOps a proactive, self-healing ecosystem. Imagine a comprehensive actions platform orchestrating every step of service health management—from prevention to detection, mitigation, resolution, and continuous learning—effortlessly and with minimal human intervention. This paradigm shift leverages the power of AI/ML to redefine operational efficiency and elevate service reliability.

## Revolutionizing Actions

Intelligent Automation reimagines actions across the entire service health management life cycle: instrument and observe, prevention, detection, triage, diagnose, mitigation, and improvement. These actions aren't just automated; they are AI-authored and dynamically orchestrated to replicate and surpass human decision-making.

Instrument and observe

AI-driven identification and integration of SLIs, logs, traces, and metrics from diverse sources, including documentation, code, and historical incidents.

Automated creation of health models and troubleshooting guides.

Automated telemetry categorization and quality assessment.

Prevention

Predict emerging health issues and automatically apply preventative measures to mitigate potential risks such as auto scale.

Detect early health degradation and promptly apply corrective actions such as pause deployment to prevent wide customer impact.

Detection

Real-time incident creation and impact-based severity assessment.

Seamless outage declaration and incident correlation.

Instantaneous notifications to relevant personnel and customers.

Triage and Diagnosis

Initiation and execution of comprehensive troubleshooting, spanning cross-service and intra-service triage.

Deep diagnostic root cause analysis and mitigation, augmented by AI.

Custom actions triggered dynamically, following an IFTTT (If This Then That) model.

Mitigation

AI powered mitigation plan creation.

Automatically apply mitigation actions to resolve the issues.

Learning and improvement

Identification and resolution of repair items to prevent recurrence.

Continuous improvement through false positive/false negative classification and analysis. Integration of these insights to enhance system accuracy and resilience.

## Pioneering Investment Areas

To bring this visionary approach to life, strategic investments are crucial:

Resilient & Secure Platform: A robust foundation to create and execute intelligent actions.

Out-of-the-Box Actions: Ready-to-deploy actions, both static and AI-driven, tailored to diverse scenarios.

Unified Entry Point: A consistent trigger mechanism for initiating actions.

Seamless Integration: Connectivity with external tools like Incident Management (IcM), change management systems, ARG, phone, SMS, and more.

Smart Orchestration Engine: Workflow-specific plugins that drive intelligent orchestration for diagnostics, notifications, and beyond.

## Vision for the Future: Self-Healing Proactive Systems

Envision Brain's Intelligent Automation as the heart of a future where services are not just reactive but proactive and self-healing. By blending AI-generated and handcrafted actions, seamlessly triggered by monitors, automation systems, or manual inputs, we create a symphony of intelligent workflows. Each action is a note in a larger composition, orchestrated by Brain to ensure service health is managed with unparalleled efficiency and minimal human intervention.

This vision elevates our systems, turning them into dynamic entities capable of learning, evolving, and autonomously managing their health. Intelligent Automation isn't just a tool—it's a transformative force driving us toward a future where operational excellence is the norm, and human toil is a thing of the past.

# Brain Intelligence Engine & Copilot experience

Large Language Models (LLMs) are set to revolutionize the entire Health and AIOps value chain, eliminating human toil from every aspect of the workflow. From authoring domain-specific metrics, monitors, and actions to continuous learning and self-correction, LLMs will be the backbone of this transformation and most importantly provide an intelligence engine that learns the service domain knowledge continuously and achieves our NorthStar of Uber DRI.

## Brain Copilot (AskBrain): Your Ultimate Digital Assistant

Imagine a world where Service Owners, Service Engineers, Designated Responsible Individuals (DRIs), Executives, Customers, Customer Support, and Sales teams can interact with a natural language interface to inquire about the health of any service or scenario. Brain Copilot, known as AskBrain, provides this seamless experience.

AskBrain, leveraging the Microsoft Copilot platform, enables:

Real-time status updates on active issues.

Assistance with diagnosing, root-causing, and mitigating issues.

Autonomous or guided corrective actions.

Integration of customer or service team systems for comprehensive insights.

Brain Copilot acts as the uber DRI for all services, possessing comprehensive knowledge of all services running in Azure. It delivers relevant information securely, tailored to the access privileges of each user.

## The Ever-Learning Intelligence Engine

At the heart of this system is the Brain Intelligence Engine, constantly learning and evolving in the background. It assimilates diverse inputs—including code, documents, incidents, customer feedback, actions, and self-analysis of patterns—to build an ever-expanding, domain-specific knowledge base. This knowledge base surpasses the capabilities of human intelligence, continually refining itself to stay current and comprehensive.

Key functions of the Intelligence Engine include:

Continuous Learning: Integrating new information from various sources to enhance its knowledge base.

Dynamic Authoring and Tuning: Applying its refined knowledge to author and adjust health metrics, health models, monitors, and actions.

Self-Correcting Mechanisms: Ensuring the system remains current and constantly improving by tweaking its own parameters and actions.

Audit and Traceability: Maintaining audit logs for all actions and recording justifications for each, ensuring traceability and facilitating corrective actions.

Augmentation by External Intelligence: Allowing customers and service teams to bring their own intelligence, augmenting Brain’s knowledge base and enhancing system performance.

## Security, Responsible AI, and Privacy

Central to the Brain Intelligence Engine and Copilot experience is a steadfast commitment to security, responsible AI, and privacy. This includes:

Security: Ensuring that all interactions and data exchanges are conducted in a secure manner, protecting sensitive information from unauthorized access.

Responsible AI: Adhering to ethical guidelines and policies to ensure AI is used responsibly, avoiding biases and ensuring fairness in decision-making processes.

Controls and Policy Enforcement: Implementing robust controls to enforce policies, ensuring compliance with regulatory standards and organizational requirements.

Privacy: Safeguarding user data, ensuring that privacy is maintained, and data is used only for intended purposes.

## Vision for the Future: Intelligent, Self-Improving Systems

The Brain Intelligence Engine and Copilot Experience embody a future where systems are not just automated but intelligent and self-improving. By leveraging LLMs and integrating customer-provided intelligence, we create a proactive, dynamic environment where human toil is minimized, and operational efficiency is maximized. This vision empowers teams across all levels to interact with and manage services effortlessly, transforming AIOps into a realm of unparalleled innovation and excellence, all while maintaining the highest standards of security, responsibility, and privacy.

# Appendix

Brain vision (June 2024).pptx

## Health monitoring experience example

Here is an example of how Brain works for Azure SQL service to evaluate and monitor its health:

#HealthEvaluation

After Brain, the new monitoring system, is rolled out to Azure SQL service, SQL engineers and their customers can now view near-real-time health information at different granularity levels, including resource, region, zone, etc. SQL service’s deployment system starts to use Brain SQL health data to determine whether deployment should proceed after an update is deployed in a region. During the process, no actions are required from the SQL engineers. SQL Health is automatically measured based on all its telemetry, existing monitors, and related data sources.

#AutoHealthMetricDiscovery

When SQL engineers publish a new SLI, it is automatically picked up by Brain to include in SQL service’s health evaluation. No additional work is required unless SQL engineers desire to exclude it or fine tune how it should impact SQL health.

#HealthIssueAlertCorrelation

With Brain, all SQL’s existing monitors’ alerts go through Brain first before the on-call engineer is engaged. Brain analyzes all the alerts based on SQL’s health and determines whether they are caused by one or more health issues. For each health issue, only a single alert will be sent to the engineers. The health issue alert is enriched with information such as customer impact, associated telemetry alert, unhealthy components, potential root cause, etc. This significantly reduces alert noise for SQL engineers and reduces their TTM (Time-to-mitigate).

Here is an example of AI Monitor experience:

#AutoMonitor

When Contoso engineers add a new metric to track their website's AI recommendation model consumption, they receive a notification that the new metric is automatically monitored by Brain.

When the website is no longer showing shopping recommendations to the users, Brain triggers a Sev-2 alert to the on-call engineers. The alert calls out the there is a spike of HTTP response code of 429 in the recommendation model response, and 42% of users are not seeing shopping recommendations now.
