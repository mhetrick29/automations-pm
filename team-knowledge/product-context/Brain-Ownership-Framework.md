# Framework for Ownership of Brain Epics and Features

Status: Signed off
Approvers: Jeff Davis, Zhangwei Xu
Other Reviewers: Feng Gao
# Purpose

To ensure **accountability**, **trackability**, and **role clarity** across Brain initiatives, we propose a consistent ownership model for **Epics** and use a **DACI framework** for **complex epics** that require work across various engineering teams.
### Existing Framework & Issues:

PM owns epic and engineering owns top level features that add up to deliver the value outlined in the epic spec.
Issues:
Lack of clarity of epic/feature definition leads to inconsistencies with reporting, tracking, and ensuring business value is delivered
Time frame for epic delivery was the whole semester, leading to unclear release cadence and an all-or-nothing business value delivery
Unclear ownership of lifecycle stages makes it hard to drive cross engineering team alignment and accountability for execution

# Definitions

**Epic****: **A solution-oriented, time-bound deliverable helping solve one or more key problems. Epics define the **end-of-semester state** and aggregate multiple features. There are 4 main phases of the epic lifecycle: Definition, Design, Execution, and Release. Definition is a continuous process based on the impact of released work on the product business value.
**Top-Level Feature**: A product release that enables new or improves user capabilities or business value. Multiple top-level features combine to fulfill an epic value. 
Top-level features are created and defined by PM epic owner and aligned with Dev owner. Top-level feature implementation & delivery is owned by dev owner and are assigned to them in ADO.
**Child ****Feature****s**: Engineering-defined work items required to deliver a top-level feature (e.g., a specific component or service capability).
The diagram below shows how we progress from definition to release, then evaluate business value to decide whether to **pivot** or **continue** with the planned approach. This creates a continuous learning loop that informs the next set of features.


# Ownership

Each epic will have a **PM owner** and a **Dev owner**. In ADO, Epics will be assigned to the PM owner and the "Dev Owner" field will be the Dev Owner
**PM Owner:** Owns Epic vision & definition. Responsible for the epic delivering expected business value.
Defines the epic and intended outcomes
Works with Dev Owner to break the epic down into top-level features / releases (what needs to be done by when)
Defines the success metrics that should be measured
Drives cross-org alignment with partner teams
Creates release announcements & evangelizes product capabilities
Confirms epic delivers expected business value as it is executed
Reports epic status internally, to partner teams, and to leadership.
**Dev Owner********:** Owns epic dev design, execution, and release. Responsible for timely delivery of the epic.
Defines overall technical design to create the engineering work required to deliver a top-level feature
Owns delivery of top-level features and creates sub-features for engineering work required for delivery
Coordinates across internal dev teams to create the engineering plan and drive execution and on-time delivery
Reports on feature / engineering progress
Helps to implement the appropriate telemetry to track the success metrics

# Forums

There are two types of reviews for reporting on & tracking progress: Engineering Reviews, and Product Reviews. Dev & PM owners should meet as necessary to align on the plan and ensure business value is delivered
### Engineering Reviews:

**Semester planning engineering review**: Review the dev design of proposed features & timelines for execution for each epic
**Additional dev design reviews** *(as needed)*: Not all top-level feature dev plans will be flushed out at the start of the semester. Set up these as needed when top-level feature work is set to begin to review the execution- planned features & dates.
**AIOps Monthly shiproom**: Discuss progress & action items for execution of top-level features
**Feature**** Launch review/Demo** *(as needed)*: Show what is set to be released & attain sign off. Potentially have demos to share amongst the AIOps team post-release.
### Product Reviews:

**Semester ****Planning reviews:** Review the proposed epic definitions & features for the upcoming period and expected business value delivered. Includes both internal reviews and the broader H+S reviews.
**Business check-ins:** This does not exist today, but we should check in on a monthly or bi-monthly basis to review progress on the customer / business value each epic is delivering.

# Example DACI Framework

Use this framework when there is significant internal cross-team alignment to clarify overall ownership & responsibilities
### DACI Role Legend

**Driver (D):** Owns the work and drives it to completion.
**Approver (A):** Has final decision-making authority. One or more approvers who make most project decisions and are responsible for success/failure.
**Contributor (C):** Provides input and helps with execution. Core list of additional designated GC’s and Owners from other spaces where their products intersect.
**Informed (I):** Needs to stay updated but not actively involved. Informed for the purposes of facilitating alignment and keeping interested parties “in the loop”.
**Forums:** Where are decisions being made & reports happening
### Example DACI Matrix for Scopes

PM Owner: Matt
Dev Owner: Feng

## Timelines (loose)




| Phase | Driver | Approver | Contribute | Inform | Forum/s |
| --- | --- | --- | --- | --- | --- |
| Definition | Matt | Jeff | Saumeela (UX)
Rajive, Feng (Eng)
Rakshith (PM) | SLO/I- Salome, Ani, Aman

Camila, Zhangwei, Mathew | Semester product planning reviews |
| Dev Design | Feng | Zhangwei | Rajive, Yueli, Jeffrey | Matt | Semester planning engineering review

Ad-hoc mid-semester reviews as needed |
| Implementation | Feng | Zhangwei | Yueli, Jeffrey, Rajive | Matt, Hi Pri customers, SLO/I | (Engineering) AIOps Monthly Shiproom

(Product) Business check-ins |
| Release | Feng | Jeff & Zhangwei | Matt | Hi Pri customers, SLO/I team | Release readiness sync |




| Phase | Epic |
| --- | --- |
| Definition | Finished by start of semester |
| Design | Epic design finished by start of semester

Dev design for top-level features should be fully flushed out >=1 week before work is set to start |
| Implementation | Semester-long |
| Release | Monthly feature release (on average) |

