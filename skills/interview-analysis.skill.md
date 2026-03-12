# Skill: Interview & Transcript Analysis

## When to Use
User asks to:
- Analyze interview transcripts or recordings
- Synthesize findings from customer conversations
- Extract insights from user research sessions
- "Analyze these transcripts"
- "What did customers say about [topic]?"
- "Summarize findings from these interviews"
- Generate the "User Research" section of a spec from interview data

This skill handles **any number of transcripts** from **any interview type** (moderated usability, customer discovery, stakeholder interviews, support calls, sales calls, design partner sessions, etc.).

---

## Before You Start: Load Context

**Required.** Before analyzing any transcript, load these knowledge sources silently:
- `team-knowledge/*.md` — domain model, terminology, capabilities, and teams
- `team-knowledge/product-context/` — current product vision and priorities

Use this knowledge to correctly interpret domain-specific language (e.g., "SLI", "outage", "DRI", "BCH") and ground findings in the product context.

---

## Workflow

### Step 1: Gather Inputs

Before analysis, collect or confirm these **4 required context components** (do NOT skip any):

1. **Project Context** — What is the scope? What decision does this research inform? (e.g., "Exploring whether to redesign the monitor configuration experience")
2. **Business Goal** — What are you trying to determine? (e.g., "Whether the new flow reduces time-to-value for onboarding teams")
3. **Product Context** — Loaded from the team knowledge above. Supplement with any feature-specific context the user provides.
4. **Participant Overview** — Who are the participants? Roles, tenure, segment, relationship to the product (current user, churned, prospect, internal).

If the user hasn't provided these, ask for them. Do not proceed with analysis until all 4 are clear.

### Step 2: Per-Transcript Extraction

For **each transcript**, extract:

| Field | Description |
|-------|-------------|
| **Participant ID** | Anonymized identifier (P01, P02, etc.) |
| **Role & Context** | Role, tenure, segment, relevant background |
| **Key Quotes** | Verbatim quotes following Quote Selection Rules (below) |
| **Observations** | Behaviors, reactions, hesitations, tone shifts |
| **Pain Points** | Specific friction or problems described |
| **Needs & Desires** | What the participant wants or expects |
| **Contradictions** | Where the participant says one thing but describes doing another |
| **Decision-Relevant Signals** | How this participant's input maps to the business goal |

**CRITICAL: Follow Quote Selection Rules for every quote extracted.**

### Step 3: Cross-Transcript Synthesis

After all transcripts are extracted:

1. **Identify themes** — Group findings across participants. For each theme:
   - Count how many participants expressed it
   - Note whether it's consistent or contradicted across participants
   - Rate strength: Strong (≥5 participants + corroborating evidence), Clear pattern (≥3-4 participants), Weak/emerging (1-2 participants)

2. **Apply Few-Shot Calibration** (if a decision scale was defined in Step 1):
   - Classify each participant's feedback against the decision-specific scale
   - Don't just count mentions — determine whether the feedback actually addresses the business goal

3. **Build Findings → Actions table:**

| Finding | Evidence (quote/observation) | Participants | Severity | Confidence | Proposed Action | Owner | Target |
|---------|------------------------------|-------------|----------|------------|----------------|-------|--------|
| F1 | "quote" [P02 ~14:30] + observed behavior | P01, P02, P05 | High | Strong | Specific change | TBD | TBD |

4. **Surface contradictions and edge cases** — Don't flatten messy data into clean themes. Call out:
   - Participants who contradict the majority
   - Tensions between stated preferences and described behaviors
   - Findings that are important but based on limited evidence

### Step 4: Quote Verification Pass

**REQUIRED.** After generating the analysis, verify every quote:

For each quote in the analysis:
1. Confirm the quote exists **verbatim** in the source transcript
2. If the quote is a close paraphrase but not exact, flag it and provide the actual wording
3. If the quote cannot be located, mark as **NOT FOUND**

Output a verification summary:
```
Quote: "[the quote]"
Status: VERIFIED / PARAPHRASE / NOT FOUND
If paraphrase → Actual wording: "[what they said]"
Location: [Participant ID, timestamp or line reference]
```

Remove or replace any NOT FOUND quotes before presenting final results.

### Step 5: Contradiction & Confidence Check

**REQUIRED.** Final verification pass:

1. **Contradiction Check** — For each participant, check if statements at different points conflict. Look for:
   - Stated preferences vs. described behaviors
   - Confidence followed by hedging
   - Strong opinions that soften later in the interview
   - Enthusiastic feature requests contradicted by usage patterns

2. **Confidence Assessment** — For any finding based on limited evidence, flag it explicitly. Note participants where the stance is unclear or mixed.

3. **Output a verification summary** with flags and recommended revisions to the analysis.

### Step 6: Present Results

Final output includes:
1. **Executive Summary** — 3-5 bullet answer to the business goal
2. **Participant Overview Table** — who was interviewed, role, segment
3. **Themes with Evidence** — each theme with strength rating, participant count, key quotes
4. **Findings → Actions Table** — with severity, confidence, proposed changes
5. **Contradictions & Caveats** — what the data doesn't cleanly answer
6. **Verification Summary** — quote accuracy, contradiction flags
7. **Recommended Next Steps** — what to validate further, who else to talk to

---

## Quote Selection Rules

These rules apply to **every quote** extracted during analysis:

1. **Start where the thought begins**, continue until the thought is fully expressed
2. **Include reasoning**, not just conclusions — capture the "because" and "but"
3. **Keep hedges and qualifiers** — they signal uncertainty ("I think maybe...", "sometimes...")
4. **Include emotional language** when present — frustration, excitement, confusion
5. **Cite with participant ID and approximate timestamp**: `[P02 ~14:30]`
6. **Do NOT combine statements** from different parts of the interview into one quote
7. **Do NOT combine statements** from different participants into one quote
8. If a quote would exceed 3 sentences, break it into separate quotes
9. Never truncate a quote to make it fit a theme better — use the full thought or don't use it

---

## Few-Shot Calibration Guide

When the business goal involves a specific decision (build/don't build, prioritize A vs B, etc.), define a **decision-specific scale** before analysis. This prevents the common failure of counting mentions without assessing decision relevance.

**How to build a scale:**
1. Define 3-5 levels from "directly supports decision A" to "irrelevant to this decision"
2. For each level, write one concrete example response and explain **why** it belongs there
3. Include the scale in the analysis prompt so the model classifies each participant's feedback

**Example (feature prioritization):**
```
1 - STRONG SIGNAL FOR: Explicit pain that this feature directly solves
   Example: "I spend 20 minutes every morning manually checking each monitor"
   Why: Specific, measurable friction. Feature directly addresses this.

2 - MODERATE SIGNAL: Related pain but could be solved other ways
   Example: "The dashboard is hard to read during incidents"
   Why: Related to the experience but a UX fix might solve it without new feature.

3 - WEAK/AMBIGUOUS: Mentions the area but no clear pain
   Example: "Yeah, it would be nice to have that I guess"
   Why: Agreeable but no evidence of real need. Don't count as signal.

4 - IRRELEVANT: Different problem entirely
   Example: "My main issue is the alerting is too noisy"
   Why: Unrelated to this feature decision. Important but separate.
```

Ask the user to help define the scale if one isn't provided. If they can't, use a generic relevance scale (Directly relevant / Tangentially related / Unrelated) and note that a calibrated scale would improve results.

---

## Severity Rubric

- **Critical**: Blocks primary task; abandonment likely
- **High**: Major friction; workarounds required; high time cost
- **Medium**: Noticeable friction; slows task; efficiency loss
- **Low**: Minor annoyance; cosmetic or polish

## Confidence Rubric

- **Strong**: Multiple consistent sources (≥5 participants) and corroborating telemetry or behavioral evidence
- **Clear pattern**: ≥3-4 participants or one strong quantitative signal
- **Weak**: Early signal / anecdotal; needs validation
- **AI-assisted**: Treat as low confidence until validated with raw data

---

## Common Pitfalls (Avoid These)

These are the 4 failure modes that silently break AI-supported analysis:

1. **Invented Evidence** — AI generates plausible-sounding quotes that don't exist in the source. Always run Quote Verification (Step 4). Never constrain quote length in ways that force the model to compress or combine quotes.

2. **False/Generic Insights** — Themes like "users want reliability" or "price matters" are useless. If a theme could describe any product in the category, dig deeper. Ask: what *specifically* do these participants mean, and how does it differ from what we assumed?

3. **Signal Without Decision Clarity** — "22 people mentioned X" is not actionable. Use Few-Shot Calibration to classify *whether* each mention actually supports the decision. Count decisions, not mentions.

4. **Contradictory Insights** — The first analysis pass always looks clean. The contradictions are invisible until you specifically look for them. Always run the Contradiction Check (Step 5) before presenting results.

---

## Notes

- This skill works with any transcript format: Teams meeting transcripts, recorded interview notes, pasted text, uploaded files, survey open-ends
- For survey data (CSV/structured), adapt Step 2 to extract per-response instead of per-transcript. Add data structure clarification (which columns are customer voice vs. metadata)
- When generating spec sections ("User Research"), use this skill's output as the evidence base and format per the spec template
