Brain AIOps: Our Purpose and Path Forward

December 1st, 2025

Over the past few months, our team has navigated more changes than most. Through all of it, you have kept moving forward, delivering impact while helping one another stay grounded. That resilience matters, and it is the reason we are positioned to build what comes next.

At our recent leadership offsite and in the AMA, we talked about who we are, what we do, and where we are headed. The questions you asked – about our charter, priorities, and how we integrate into Azure Core – shaped this next step.

This paper builds on that conversation. It captures our direction and the principles that will guide how we work together as one team – Brain AIOps.

Our mission is to make reliability and velocity the default of Microsoft Cloud.

# Why We Exist

Our team builds automated service health systems that utilize signals from many different sources to provide insights and take actions that reduce human toil. As AI advances, the autonomy of these systems will continue to increase.

The goals of this work are:

Customers gain greater trust running their business on Microsoft Cloud, experiencing fewer issues and faster recovery.

Developers, PMs, and Data Scientists spend more of their time addressing customer needs and creating business value, freeing millions of hours each year from caring for and feeding the system.

Development velocity increases as engineers push changes confidently, knowing our systems will protect customers from issues.

When we joined Azure Core, Girish underscored that Brain is the strategy. Reliability, quality, and operational excellence are now central to how Azure competes and how customers measure trust. Brain AIOps operationalizes that intent - connecting telemetry, insights, and automation to continuously improve reliability. Brain is the intelligence layer and single source of truth for service health across the Microsoft Cloud.

Through Brain, we enable the flow from service health through detection, triage, diagnostics, communication and mitigation, while shifting left into prevention and strengthening SLI and non-SLI signal generation at source. We integrate with deployment systems to catch issues before release and automate health validation tests. We work closely with service and partner teams to ensure telemetry at the source enables earlier detection and faster diagnosis. Reliability is not the only goal; it is what earns us customer trust and the right to innovate with increased velocity.

Brain is an extensible system. By providing well-defined interfaces that adhere to applicable standards, it enables teams across Microsoft to contribute innovations and IP, thus creating a unified ecosystem that accelerates reliability improvements at scale.

As we continue to build the platform that drives reliability and automation, we will support both 1P and 3P scenarios where there is clear customer value — integrating data across 1P and 3P services, closing feedback loops, and continuously enhancing detection, triage, and diagnostics through telemetry and insights.

# How We Measure Success

We need to be thoughtful about how we measure progress. Too many measures can create noise, so we anchor on a small set of metrics that reflect what truly matters – improving reliability, reducing customer impact, and freeing engineers’ time.

Our guiding principle is simple: prevent customer-impacting issues before they reach production. This standard applies not only to Brain AIOps services, but also across the entire Microsoft Cloud.

To keep our focus clear, we organize our core measures around the reliability lifecycle:

Prevention – Brain Deployment Stops

Change is the largest cause of outages. We need to prevent 100% of these change-related issues in pre-production environments. We measure success by the percentage of preventable issues Brain stops before they reach customers, and we will continue to push detection and prevention further upstream.

Detection / Declaration / Notification – Time to Notify (TTN)

We build trust by notifying customers before they experience an issue. TTN measures how quickly we detect an incident, assess its impact, declare it, and communicate to customers. It provides a single SLT-level view across detection, assessment, and notification. Our long-term goal is to notify customers within 15 minutes of impact start, and progress toward this target is a key indicator of improved reliability.

Response / Troubleshooting / Mitigation – Time to Mitigate (TTM)

Success means reducing or eliminating customer impact as quickly as possible once an issue is detected. TTM reflects the combined work of triage, diagnostics, troubleshooting, and mitigation, and is the SLT’s primary response metric.

Customer Impact – Sev-A / Support Volume (relative to non-Brain declared outages)

Customer impact is measured by how often customers experience meaningful issues and the extent of the disruption those issues cause. Sev-A counts and support volume provide a clear, SLT-recognized signal of customer-visible interruption and are the most reliable indicators of whether experience is improving over time and whether Brain is materially improving outcomes compared to non-Brain-declared outages. Our goal is fewer meaningful issues and less disruption when they occur, and we measure ourselves by progress toward that goal.

Engineering Thrive – Innovation and Toil

We succeed when engineers spend more time building value and less time on operational burden. These measures capture how much toil we eliminate and how much time we give back to engineers for innovation and meaningful problem-solving. This includes reducing DRI interruptions, lowering operational load, and removing repetitive manual steps across engineering workflows. Our aspiration is to meaningfully shift engineering time from operating the cloud to building what’s next.

Together, these measures tell one story – how quickly we can find issues, fix them, reduce their impact, and ultimately prevent them. As we do the work and as Brain evolves, additional measures may be used to guide specific improvements, but the focus remains the same – clarity over complexity, prevention as the goal, and becoming a learning system that improves with every incident.

# How We Work

Our effectiveness depends on how we operate together. We succeed when we are clear, connected, and accountable - when everyone understands the outcomes we are driving toward and how their work contributes to them. Reliability starts with how we work – in the clarity of our goals, the quality of our execution, and the consistency of our follow-through.

Clarity and alignment. Each team’s priorities should ladder up to a single, coherent story of how we improve reliability and accelerate innovation. Everyone should understand how decisions are made, who owns them, and how progress is measured.

Accountability and follow-through. When we commit to something, we see it through. We hold ourselves and each other accountable for quality, operational excellence, and results.

Product mindset. Everything we build should scale – designed as a product, not a one-off, usable across Microsoft with clear, self-service adoption pathways. At the same time, we innovate quickly through iteration, delivering value early and refining with real-world feedback rather than waiting to solve every problem upfront. When our tools and platforms can be consumed easily by other teams, our impact amplifies.

Partnership and collaboration. Be helpful – that’s how partnerships are built. We drive the platform but stay closely connected with partners across C+AI and E+D. Reliability is a team sport, and our success depends on how well we work with others. The goal is simple: other teams should say we are great partners – that they love working with Brain AIOps because we make it easier for them to deliver reliability and velocity. That shows up in how we show up: being responsive, collaborative, and committed to shared outcomes.

This is what it means to be Brain AIOps: one team shared purpose and shared accountability. When we’re aligned, learning, and helpful to one another, our impact compounds - the systems get smarter, the cloud get healthier, and our customers benefit every day.

# Where We Are Going

As we move into the next phase of Brain AIOps, our direction must be clear, anchored in the commitments we have today while being transparent about what remains aspirational.

Strengthening our Core: 1P.

Our primary responsibility is unchanged: we are accountable for the 1P experiences end-to-end, including detection, triage, diagnostics, mitigation, and prevention enabled through deployment gating and predictive signals. This is where our product and engineering focus will remain. Strengthening, scaling, and maturing these systems is the core of our mission.

As the system matures, the individual tools we support today should also evolve from standalone, manually triggered experiences into proactive insights that automatically surface where developers spend most of their time, including Jarvis and other operational touchpoints, through Brain’s intelligent AIOps workflows and signals, with deeper integration into IcM, Change, Deployment and other operational systems so insights surface seamlessly within the developer and incident lifecycle.

Building on Existing Foundations Enabling Brain.

Brain AIOps build on proven systems that already power reliability across Microsoft services. Key examples include Geneva Health Monitoring, Geneva Synthetics, SimSelf, Azure Notification Service (AzNS), Azure Profiler, Execution Graph, Fleet Diagnostics, and core Azure Monitor capabilities such as SLI streaming, Log Search Alerts, etc. for various Brain scenarios. These systems and tools collectively enable end-to-end reliability by providing granular health checks, anomaly detection, automated notifications, large-scale telemetry ingestion, root cause analysis, and performance insights. They are integrated into workflows that route service health alerts and diagnostics to the right endpoints.

By incorporating these capabilities under the Brain umbrella, we move from standalone tools to a unified, intelligent AIOps system, one that surfaces actionable insights, closes feedback loops, and supports extensibility for our experiences. This integration strengthens our ability to deliver reliability at scale without creating fragmented solutions.

Focused, Durable 3P Commitments.

We will maintain a set of 3P commitments where the customer value is clear and measurable. Today this includes our diagnostics integrations for Distributed Tracing and VM troubleshooting in Azure Monitor, and ongoing support for the Performance Diagnostics tool used by Microsoft customers. These are foundational capabilities that Azure service teams rely on to deliver on their releases confidently and reliably.

Future Aspirations.

Looking further ahead, there is a long-term aspiration for Brain to support more 3P scenarios and eventually evolve into something external customers could consume directly. Therefore, we should build our 1P product with a mindset that allows it to naturally extend to 3P rather than creating separate pathways or introducing a future convergence problem.

That said, this remains an aspiration, not a current priority. It is important that the team can distinguish between what is actionable today and what represents where Brain may go over time. By focusing on our core 1P responsibilities and honoring the specific 3P commitments we already have, we give ourselves the clarity and space required to mature Brain AIOps into a unified, intelligent platform. As Brain AIOps evolves, this foundation will enable us to take on more ambitious scenarios with confidence and clarity.

# What Success Looks Like

Success for Brain AIOps will be measured by the impact it creates for customers, engineers, and the Microsoft Cloud.

For customers, success means fewer outages, faster recovery, and timely and clear communication. Reliability becomes something customers can take for granted, not something they need to worry about.

For engineers across Microsoft, success means less toil and more time spent on what matters most. As more tasks are automated and systems take on repetitive and operational work, developers, PMs, and data scientists can focus on building new capabilities and solving customer problems. Each improvement in reliability creates more space to innovate safely and with confidence.

For Microsoft Cloud, success means a platform that learns and improves with every incident. We will know that we are succeeding when we see fewer support calls, fewer critical escalations, faster detection and mitigation, and stronger customer trust in the reliability of the platform. Detection, triage, diagnostics, mitigation, and prevention become part of a connected loop reducing risk and continuously raising the bar for quality and resilience.

When these things come together, the result is not just a more reliable cloud, but a more capable one - a system that protects customers, amplifies engineering impact, and earns trust through performance every day.

# Closing

The path ahead is ambitious, but it’s the right one. Brain AIOps sit at the center of how Azure delivers reliability and velocity at scale. Every system improved, every signal connected, and every hour of engineering time freed up brings us closer to a cloud that operates and learns on its own.

The work ahead depends on clarity, accountability, and shared purpose. This team has the talent, resilience, and creativity to build what comes next - a smarter, faster, more reliable Microsoft Cloud.
