# Brain UX Development Process Improvement

# Why

The purpose of this document is to propose a process for the Brain PM & Eng teams to follow with the design team. As Brain moves towards a true product with the goal of a public preview candidate release in the [Se] semester, the user experience and user flow within the product becomes of paramount importance. Thus, we want to eliminate some of the pain and frustration felt with the current undefined UX development process. We will try out an initial new process and iteratively improve the best practices.
# Current Process

## What works

Team is very flexible and can quickly pivot based on new learnings
Quick iteration on smaller features is very efficient
Team is very open-minded and excited about all the work
Designs are created & iterated very efficiently
## What doesn’t & current pain

While we are still delivering key capabilities and driving value, the lack of a standard process for UX development E2E across PM/Dev/Design has led to delays in development, frustration due misalignment, and overall lack of clarity in how the team is supposed to operate.
The main flow (L->R) today is:

Summarizing these issues: 
No Eng insight into design progress, no design insight into eng development progress
No standard release cadence leads to customers (sometimes even Brain team) being surprised new features were released
No standard review process for PM spec, UX design, Eng design, and Eng implementation leads to:
Designs that aren’t implemented
Backend work that doesn’t match up with frontend timeline
Eng team ready before designs
Fit & finish slips through the cracks and adds up over time (font, spacing, colors, accessibility, etc.)
Designs are often more big-picture than what dev is going to implement
# New Process Proposal

This process covers both large feature work (i.e. an entirely new UX experience or large overhaul) and smaller feature work (i.e. a specific form update). The main difference will be the **timeline **and the **design review**. 
For large features, each step will take longer, and design review with leadership (Mathew & Zhangwei) is **required**
PERs at the John/Farzana level should be scheduled as needed for 2 styles of reviews:
New UX experience being launched (i.e. Brain public preview candidate)
This will usually become clear during the planning process what needs to be reviewed here
Cross-org work (i.e. service health vision across Brain & Obs)
General proposal is to have 3 distinct sections: **PM spec**, **UX design**, and **Eng implementation**. 
Below is a breakdown of each section:

## Reviews [WIP]

### Design review

**Goal**: Engineering understands the problem we are tackling and signs off on the design being ready to implement.
**Components:**
- Focus on users, why, and problems and how the design solves those problems
- User feedback summary
- Flow should be very targeted to the flow that solves the problem, not a sitemap where you need the whole product put together

### Sign off/fit and finish

**Goal**: Design team approves the implementation of the UX for release 
**Components:**
- Does implementation meet design expectations?
- Go through bugs/gotchas/redlining/fonts/patterns
- Have we tested with users to see if they can use it?
- Next steps for how we plan to gather feedback & iterate

### Product Experience Reviews

**Goal: **Communicate a vision outside the team (LT, other PMs)
**Components:**
- More broad than a targeted problem, set of problems and showing how a bunch of different user flows add up to an experience and multiple users
- Leave with sense of "There were problems xyz and now I see how those problems will be fixed with this proposal"
PER - Framing.pptx

## Rollout & Iteration Overview [WIP]

### Rollout

One thing we need to consider is if an individual feature should be rolled out individually or included in a larger “Brain version”-style release (i.e. Brain 2.1.1). 
Also need a release announcement template that gets sent as part of a deployment.
### Measurement & Iteration

Once a full UX or a feature is rolled out initially, at least 1 iteration for the pilot customers should be completed to ensure smooth experience before rolling out more broadly. 
We should include 1-2 user feedback sessions with the design team. 
Below is some guidance for how to measure this and determine the highest priority components to include in the iteration: 
Adoption: what can you do to educate users? ObsCon, Cloud talks, Brain info sessions, engineering reviews, tech talks, etc.
Check telemetry: Where are users clicking/spending the most time? How are they getting there? 
Explicit feedback: Talk to pilot set of customers and see if they have feedback
Dedupe: Are there any superfluous components that overlap with existing things (ie SLI insights & BCH
Success & energy: Share stories & user feedback! And use in QDD, MBR, newsletter, etc. to celebrate the team’s work & generate excitement

# Tracking in ADO

Guiding principle: All work required to complete a specific feature is bucketized at the subfeature level. Therefore, the PM Spec, UX Design should be tracked at the L2 (subfeature) level underneath a specific L1 feature at the same altitude as the eng features needed to complete the work. 
Epic 1
Sample Feature 1 (suppose it needs work across core, BCH, and analytics)
Feature 1: PM Spec 
PBI: Draft spec
PBI: Final version spec
Feature 2: UX design 
PBI: Initial mock
PBI: Final mock
Feature 3: Brain core work (PBIs created by eng)
PBI 1
PBI 2
…
Feature 4: BCH work
PBI 1
PBI 2
…
Feature 5: Analytics work
PBI 1
PBI 2
…
Completion of the PM spec feature means both PBIs (draft, final version) are complete. 
Leverage delivery plan

# Measures of Success

Based on the issues summarized in the , the best measure of success for this process is clearer understanding and less frustration with the process. Thus, a way to measure that is with a team survey. We will know this new process is successful if:
Brain pain form (to be sent out) shows reported improvement
All
Rating of clarity with process, timeline, and what is expected in each stage
PM
Report of how frequently “surprised” about features
Rating of clarity on expectations for what to include in PM spec
Rating of ease for tracking design & dev progress
Design
Rating of how easy it is to come up with mocks based on PM spec from design team
Rating for satisfaction that design knows what & when to deliver what altitude of mocks
Satisfaction of working with Brain team
Eng
Rating of how easy mocks are to implement
Rating of clarity on fit & finish
Satisfaction of how ready designs are when eng is ready to code
% mocks implemented (needs baseline)

# Appendix

## Feedback from Dev

Who should we address specific questions to? I understand we may be getting designers assigned on a rotation basis so we won't have a single consistent design point of contact so I want to ask PM to either proxy that contact as needed or keep us updated with who we can address questions to not add additional burden on PM.
Can we get redlines for look and feel specifics?  We can then more easily snap to those and have independent design reviews from implementation launch reviews.
Have separate design reviews that sign off on look and feel in mockups and/or redlines as much as possible before dev implementation.
If redlines are not an option (yet), we need an iterative review process for proposed aesthetics vs. functionality that we can crank through to not slow down implementation or wait to catch polish issues late in the release cycle.  I think we could even do this with screen shots in a Teams channel so long as we preserve any major decisions or feedback someplace easier to review later.

## Observability guidance/tips

### PER tips (Ani)

It's usually when we have a plan to start executing/delivering on something
Here is the experience we want to ship for GA; time permitting we may show the MVP we are starting with
### UX rollout (Sonal)

Customer feedback needless to say - get lot of inputs. This is easier if u have a running UX then people have something to complaint about and identified gaps can be bridged. However, if its a new UX - then relatively difficult to envision it. So usually good starting point is - identify whom you want to build this for- what they might be needing- what resources do they have today that you can use for your UX... etc., then iterate- show and tell-iterate. 
When UX is already in initial phase - Adoption is the metric to go for - so what can you do to educate users. ObsConf, Cloud talks, SLO sessions, brown bags etc. 
For more steady UX - check your telemetry -- where is the max focus on? who is it from.. what r they looking.. who came and did not come again.. etc.- this will help gather feedback. 
Lastly, is it overlapping with existing UX- like Insights and S360 SLO was-- so we removed one in favor of the other. Similarly, BCH and SLI insights- what can you do to merge the two to help the end user. 
Share stories.. so when we got someone successfully using SLI insights - we used that story for QDD, MBR, newsletter -- so word of mouth and LT support engaged more folks on what they can do as well.
### Cadence & Planning (Ayesha)

For the initial phase of design we had very frequent syncs (3-4x week) with the design team to iterate quickly. And one weekly sync with design+dev team to share the progress of the week.
Once the screens were medium/high fidelity we started to run user interviews to validate those designs and iterate (thanks to Rachana!) and synced once a week with the full team.
We had a usage dashboard to track telemetry (# of new users, # of users opting out etc.) once we had our initial UX 
Then just following what Sonal added above ^ tried to share stories wherever possible, PER, Demos of the UX everywhere 







| Stage | PM spec completed | UX Design complete | Eng Development | Eng bug bash | Release |
| --- | --- | --- | --- | --- | --- |
| Pain | Sometimes no spec & simply work with design to come up with things
No defined timeline
Not tracked in ADO | No formal sign-off
PM spec->design often has gaps with no clear process
No defined timeline
Not tracked in ADO | Often multiple questions about spacing, font, little things “falling through the cracks” for edge case scenarios | No design sign-off
Fit and finish best practices undefined | Emails often custom, no template and no standard cadence |




| PM Spec
Target: 1 month | Weeks 1-2: Draft PM spec 
End of week 2 PM subteam review
Week 3: Iterate based on 1st review
End of week 3 PM team & Dev lead (ie Andy/Jeffrey) review
Week 4: Target for sign-off
End of week 4 sign-off from PM lead & Dev lead
Design kick-off |
| --- | --- |
| Exit Criteria: PM & Dev sign-off, Design Kick-off meeting | Exit Criteria: PM & Dev sign-off, Design Kick-off meeting |
| Design Process
Target: 1 month | Weeks 1-2: initial phase of design
Frequent syncs (3-4x week) between PM & design team to iterate quickly
1 weekly sync w/ design+eng to share weekly progress 
Target end of week 2 med/high fidelity designs
Week 3-4: User feedback
Run user interviews to validate designs & iterate
Sync 1x per week with the full team (PM/Eng/Design)
End of week 4 eng sign-off of designs with delivery roadmap defined (MVP, Preview, GA) |
| Exit Criteria: 
Complete design review w/ Brain LT (Mathew/Zhangwei). LT may not be necessary for smaller features. See below for more details on design review | Exit Criteria: 
Complete design review w/ Brain LT (Mathew/Zhangwei). LT may not be necessary for smaller features. See below for more details on design review |
| Eng work | Guiding principles:
PM planning defines targeted delivery of feature work
Eng work will be scoped by the dev team based on costing in planning
Once cost (ppl & time) is loosely defined by dev team, begin PM spec & design process 2 months before eng work needs to start to deliver the feature work on time
Weekly “standups” to ensure flow & functionality is aligned with desired outcome
Bug bash held ~1 week before anticipated deployment review
Sample for M1 delivery |
| Exit Criteria: Final deployment/delivery review with PM, Eng team, Design for overall sign-off | Exit Criteria: Final deployment/delivery review with PM, Eng team, Design for overall sign-off |

