# Skill: Customer Requirements Analysis

## When to Use

Activate this skill when the user provides **customer-authored documents** that describe their challenges, needs, or feature requests — such as:

- Customer requirement docs or wish lists
- Partner feedback documents
- Customer-written problem statements or RFPs
- Compiled customer asks from account teams
- "Top N requests" documents from customer-facing teams

This skill is **not** for interview transcripts (use `interview-analysis.skill.md`) or internal brain dumps (use the brain-dump agent). It's for written, polished documents where customers have had time to think — which means they've often gone further into solution space than they would in conversation.

---

## Before You Start: Load Context

**Required.** Before analyzing any customer document, load these knowledge sources silently:

1. `team-knowledge/product-context/` — current product vision, priorities, and roadmap
2. `team-knowledge/*.md` — domain model, capabilities, teams, ecosystem, and terminology
3. `skills/product-why-first.skill.md` — the five-layer analysis framework (used heavily throughout)

This context is essential for two reasons: understanding what the customer is really asking about, and classifying each need against the current state of the product.

---

## Workflow

### Step 1: Gather Inputs

Before analysis, collect or confirm these **4 context components**:

1. **Customer Context** — Who is this customer? What services do they run? How mature is their usage of the product? What's their relationship (design partner, early adopter, GA customer, internal)?
2. **Document Context** — Why was this document created? Was it solicited (we asked) or unsolicited (they volunteered)? Who authored it — the end user, their manager, an account team intermediary?
3. **Business Goal** — What decision does this analysis inform? (e.g., "Prioritize next quarter's investments", "Validate our current roadmap", "Identify gaps in the V1 experience")
4. **Product Context** — Loaded from the team knowledge above. Supplement with any feature-specific context the user provides about what exists today.

If the user hasn't provided **Business Goal**, ask for it — this frames the entire analysis. For the other 3, derive what you can from the document itself and state your assumptions; ask only if critical context is genuinely ambiguous.

### Step 2: Per-Document Extraction

For **each customer document**, extract the following. Use the `read-doc` tool if the input is a `.docx` / `.pptx` file. If the input is a **SharePoint URL**, use the `doc-handling` skill (Operation 0) to download and extract the document first.

| Field | Description |
|-------|-------------|
| **Customer ID** | Anonymized or named identifier (C01, C02, or company name if approved) |
| **Customer Profile** | Role, service type, scale, maturity with the product |
| **Stated Asks** | Every explicit request, feature ask, or stated need — captured in the customer's own words with section/paragraph reference |
| **Underlying Problems** | For each stated ask, apply the five-layer analysis (see Step 3) |
| **Workarounds Described** | What the customer currently does to compensate for gaps |
| **Emotional Signals** | Frustration, urgency, resignation, enthusiasm — these reveal severity |
| **Organizational Signals** | Political framing, escalation language, VP-level pressure, compliance/audit drivers |
| **Contradictions** | Where the document says one thing but implies another, or where different sections conflict |

**Quote Selection Rules** (adapted from `interview-analysis.skill.md`):
- Capture the customer's exact phrasing with a section or paragraph reference: `[C01 §3.2]`
- Include reasoning, not just conclusions — capture the "because"
- Keep hedges and qualifiers — "ideally", "if possible", "we'd like" signal priority
- Do NOT combine statements from different sections into one quote
- Do NOT paraphrase to make a quote fit a theme

### Step 3: Why-First Analysis (Per Ask)

**This is the core of the skill.** For every stated ask extracted in Step 2, apply the five-layer analysis from `product-why-first.skill.md`:

| Layer | Question | What to look for |
|-------|----------|------------------|
| **1. Stated Solution** | What is the customer explicitly asking for? | Their exact words. This is often a feature they've designed, not their actual need. |
| **2. Underlying Problem** | Why do they want that? | Workarounds, time spent, emotional language, frequency, current behavior, job-to-be-done. Look for signals *elsewhere* in the doc — customers often describe the problem in one section and propose the solution in another. |
| **3. Root Cause** | Is this the actual problem or a symptom? | Apply five-whys. Watch for problem chains, systemic issues, hidden costs. |
| **4. Value Connection** | Does solving this advance the product's mission? | Map to product strategy and value proposition. |
| **5. Solution Fit** | Does their proposed solution address the root cause? | Would something simpler, more scalable, or more aligned with the platform solve it better? |

**Written-document-specific considerations:**
- **Political framing** — "We require X" may mean "my VP told me to ask for X." Look for whether the document explains *who* is affected and *how*, or just states the requirement authoritatively. Requirements without user context are a red flag.
- **Solution depth as signal** — When a customer has designed a detailed solution (with UI mockups, API shapes, etc.), it often means they've lived with the problem long enough to build a mental model of the fix. The problem is likely real and severe, even if their solution isn't the right one.
- **Aggregation artifacts** — If the document was compiled from multiple internal sources, different sections may reflect different people's priorities. Watch for inconsistencies that signal a compiled doc.

### Step 4: Product-State Classification

**For each excavated need (not stated ask), classify it against the current state of the product.** This is what makes the analysis actionable — it tells you what kind of work each need implies.

Use these categories:

| Classification | Definition | Signal | Example |
|---------------|------------|--------|---------|
| **Already shipped** | The capability exists today but the customer doesn't know about it or isn't using it | Indicates an enablement, documentation, or discoverability gap — not a build | Customer asks for alert suppression during maintenance; product already has maintenance windows |
| **On the roadmap** | The need aligns with planned or in-flight work | Validates prioritization; note if timeline aligns with customer urgency | Customer asks for custom detection models; this is a planned H2 investment |
| **Feature gap — extend existing** | The core capability exists but needs enhancement to meet this need | Smaller scope; likely an iteration on existing architecture | Customer needs monitor templates; monitors exist but no template/reuse mechanism |
| **Feature gap — net new** | No existing capability addresses this need; new feature required | Larger scope; needs spec work and prioritization | Customer needs cross-service correlation; no correlation engine exists |
| **Program/bespoke ask** | Not a product feature — requires custom automation, one-off configuration, or dedicated engagement | May indicate a gap in self-service capability, or may be legitimately bespoke | Customer needs a custom integration with their internal ITSM tool |
| **Process/operational** | The gap isn't in the product but in how we engage, support, or onboard | Requires non-engineering response — CSM, documentation, training | Customer says "we didn't know this existed" or "support was slow" |
| **Out of scope** | The need falls outside the product's mission or value proposition | Important to name explicitly so stakeholders don't expect it | Customer wants the product to replace their SIEM |

For each classification, also note:
- **Confidence** — How confident are you in this classification? (High / Medium / Low)
- **Evidence** — What in the document and product context supports this classification?
- **If "already shipped"** — What's the enablement gap? Why doesn't the customer know?

### Step 5: Cross-Document Synthesis

After all documents are analyzed:

1. **Find common root causes** — When multiple customers ask for different features that trace to the same underlying problem, that's the real signal. Group by root cause, not by stated ask.

2. **Build the Stated Ask → Underlying Need map:**

| Customer | Stated Ask | Root Cause (excavated) | Classification | Severity | Confidence |
|----------|-----------|----------------------|----------------|----------|------------|
| C01 | "Customizable thresholds" | Detection model doesn't account for service-specific baselines | Feature gap — extend existing | High | High |
| C02 | "Better alerting filters" | Same root cause as C01 — false positives from generic baselines | Feature gap — extend existing | High | High |
| C03 | "Export to CSV" | Need to share insights with executives without product access | Feature gap — net new | Medium | Medium |

3. **Aggregate classification counts:**

| Classification | Count | % of Total Asks |
|---------------|-------|----------------|
| Feature gap — extend existing | X | Y% |
| Already shipped | X | Y% |
| ... | | |

This distribution tells you whether the customer feedback is primarily about product gaps, enablement gaps, or scope misalignment.

4. **Identify themes and prioritize** — For each theme:
   - How many customers expressed it?
   - What's the severity and confidence?
   - Does it align with current product strategy?
   - What's the classification — does this need engineering, enablement, or program work?

5. **Surface contradictions** — Don't flatten messy data:
   - Customers who want opposite things
   - Asks that conflict with product strategy
   - Needs where the classification is ambiguous

### Step 6: Evidence Verification Pass

**REQUIRED.** After generating the analysis, verify every customer quote:

1. Confirm each quote exists **verbatim** in the source document
2. If it's a close paraphrase, flag it and provide the actual wording
3. If it cannot be located, mark as **NOT FOUND** and remove from findings

Output a verification summary (same format as `interview-analysis.skill.md`):
```
Quote: "[the quote]"
Status: VERIFIED / PARAPHRASE / NOT FOUND
If paraphrase → Actual wording: "[what they said]"
Location: [Customer ID, section/paragraph reference]
```

### Step 7: Present Results

Final output includes:

1. **Executive Summary** — 3-5 bullets answering the business goal. Lead with the most important finding. Include the classification distribution.
2. **Customer Overview Table** — who provided input, their profile, document context
3. **Stated Ask → Underlying Need Map** — the core artifact, with root causes, classifications, severity, and confidence
4. **Themes with Evidence** — grouped by root cause, not by stated ask. Each theme includes strength rating, customer count, key quotes, and classification
5. **Classification Summary** — aggregate view of what kind of work the customer feedback implies (build vs. enable vs. program)
6. **Product Alignment Assessment** — where customer needs align with current roadmap, where they diverge, and what that means for prioritization
7. **Contradictions & Caveats** — what the data doesn't cleanly answer
8. **Verification Summary** — quote accuracy and contradiction flags
9. **Recommended Next Steps** — what to build, what to enable, what to investigate further, who to talk to

---

## Red Flags in Customer Requirement Docs

Watch for these patterns that indicate the stated ask isn't the real need:

- **Solution-as-requirement** — "We need a dashboard with X, Y, Z" is a solution. The requirement is what they'd *do* with that dashboard.
- **Feature parity framing** — "Competitor X has this" without explaining why it matters for their workflow.
- **Aggregated asks without user context** — A bulleted list of features with no explanation of who needs each one or why. Often a compiled doc from a PM or account team, not actual user voice.
- **Urgency without severity** — "We need this ASAP" without explaining the impact of not having it. Urgency is often organizational (VP asked for it), not user-driven.
- **Universal language** — "All customers want X" or "Everyone needs Y" — probe for specifics.
- **Acceptance criteria as requirements** — "The system shall..." language that describes implementation, not outcomes.

---

## Severity & Confidence Rubrics

**Severity** (adapted from `interview-analysis.skill.md`):
- **Critical**: Blocks the customer from using the product for a primary use case; potential churn risk
- **High**: Major friction; customer has built workarounds; significant time/effort cost
- **Medium**: Noticeable gap; customer can work around it but it limits value
- **Low**: Nice-to-have; cosmetic or efficiency improvement

**Confidence** (in the excavated need, not the stated ask):
- **Strong**: Multiple customers surface the same root cause; corroborated by workaround descriptions or telemetry
- **Clear pattern**: 2-3 customers; consistent evidence in the documents
- **Weak**: Single customer; limited evidence; need to validate with more data
- **Inferred**: The root cause was inferred from the stated ask but not explicitly described in the document — flag for follow-up

---

## Notes

- This skill handles any number of customer documents
- For interview transcripts or recorded conversations, use `interview-analysis.skill.md` instead
- When generating spec sections from the output, the Stated Ask → Underlying Need map becomes the evidence base for the Customer Problems section
- The classification summary maps directly to work planning: engineering backlog (feature gaps), enablement work (already shipped), program engagement (bespoke asks), process improvements (operational)
