# Skill: Product Shaping

## When to Use

Invoke this skill when the PM Lead activates the product shaping pipeline — turning a product idea into a validated spec (or prototype) through structured conversation.

Activate when:
- User says "shape", "scope this", "new feature", or starts scoping a new product investment
- User wants to go from idea → research → spec in a single workflow
- User has a half-formed product concept that needs problem framing, evidence gathering, and design convergence
- User has a product idea at any stage of maturity — the pipeline adapts to where they are

The user can enter at any phase. Read their conviction level and existing context:
- **Raw idea, no validation** → Start at Phase 1 (Triage)
- **Clear problem, needs evidence** → Start at Phase 2 (Research)
- **Has evidence and conviction, needs a spec** → Start at Phase 3 (Shape)
- **Already fleshed out, needs a prototype** → Skip pipeline entirely → route to Prototyping agent

This skill is an **orchestration guide** — it tells the PM Lead how to sequence agents and manage handoffs. The actual work is done by Idea Triage, User Research, and Spec Writer agents.

---

## Output

The shaping workflow produces:
- **Triage summary** — saved to `ideas/<slug>-<date>.md` (from Idea Triage agent)
- **Research artifacts** — saved to `research/*.md` (from User Research agent + competitive-research skill)
- **Spec draft** — saved to user-specified path (from Spec Writer agent)
- Or: **Prototype** — HTML variants or full-stack scaffold (from Prototyping agent)

---

## Phases

### Phase 1: Frame + Triage

**Agent:** Idea Triage

**Goal:** Define the problem, surface the key assumption, and decide if this is worth investing in.

The Idea Triage agent drives this phase. It will:
1. Clarify the idea through 1–3 conversational questions
2. Surface the core behavior change, simplest interaction loop, and key assumption
3. Apply product-why-first analysis (root cause vs. symptom, alignment with priorities)
4. Assess strategic leverage (what does this unlock beyond the feature?)
5. Generate 3–5 validation approaches
6. Save triage output to `ideas/`

**Transition:** After triage completes, ask the user:

> "We've got the core framed. Before shaping further, do you want to run research? I can do competitive analysis, dig into customer evidence, audit what we already have, or do domain learning. Or if you have enough conviction, we can skip straight to shaping a spec."

If the user wants research → Phase 2.
If the user wants to go straight to spec → Phase 3.
If the idea was killed in triage → stop, save with status `rejected`.

---

### Phase 2: Research (User Selects Streams)

**Agent:** User Research (with competitive-research skill as needed)

**Goal:** Gather evidence to inform the design and increase confidence.

#### Available research streams

| Stream | Skill/Tool | Output File | When to Recommend |
|--------|-----------|-------------|-------------------|
| Competitive research | `skills/competitive-research.skill.md` | `research/{platform}.md` + `research/best-practices.md` | Almost always — understand the landscape before designing |
| Customer evidence (transcripts) | `skills/interview-analysis.skill.md` | `research/call-evidence.md` | When customer conversations exist on this topic |
| Customer evidence (docs) | `skills/customer-requirements-analysis.skill.md` | `research/customer-evidence.md` | When customer requirement docs or RFPs exist |
| System audit | Direct tool use (ADO, GitHub MCPs) | `research/system-audit.md` | When we might have existing infrastructure to reuse |
| Domain learning | Web research | `research/domain-context.md` | When the problem domain is unfamiliar |

#### Before launching research

1. **Agree on search keywords.** Propose terms based on the problem framing. Ask the user to add terms their customers, sales reps, and engineers use. The same problem has different names in different contexts — keyword alignment prevents blind spots.

2. **Confirm which streams to run.** Don't default to "run everything." Ask the user which streams are worth the time based on what evidence they already have and what gaps exist.

3. **Recommend streams Claude thinks are valuable.** Be specific about why:
   - *"This touches billing — I'd recommend reviewing Stripe and Zuora docs for API patterns before we design ours."*
   - *"Construction domain — I'd suggest domain learning on lien waiver workflows before designing."*
   - *"You mentioned an existing API — I should audit the codebase to see what's reusable."*

#### After research completes

Present a concise synthesis. Don't dump raw findings — distill:
1. **Key patterns from competitors** — what the best platforms do, what to avoid
2. **Customer signal strength** — how many deals, what stage, attributed quotes
3. **What we already have** — what's reusable, what's missing
4. **Open questions** — things the research raised that the design needs to resolve

If some streams were skipped, flag what's missing and whether it matters for the spec.

**Transition:** After presenting the synthesis, offer:

> "Research is done. Ready to shape the spec? I'll feed the triage and research into the Spec Writer for a brainstorm session."

---

### Phase 3: Shape (Converge on a Design)

**Agent:** Spec Writer (brainstorm mode)

**Goal:** Converge on a design through iterative conversation.

Feed the Spec Writer:
- Triage summary from Phase 1
- Research findings from Phase 2 (if research was run)
- Any additional context the user provides

The Spec Writer drives the dialogue from here using its brainstorm mode — probing on requirements, challenging scope, applying multi-lens analysis, and producing the spec.

#### What makes shaping different from "just write a spec"

The Spec Writer already does excellent brainstorm-mode specs. The difference in a shaping workflow is:
- **Research is already done.** The Spec Writer can reference competitive patterns, customer evidence, and system audit findings instead of asking the PM to provide all context from memory.
- **The key assumption is already identified.** From triage. The spec should test or resolve this assumption, not ignore it.
- **Strategic leverage is known.** The spec should address how to capture the leverage identified in triage (GTM, competitive positioning, segment unlocking).
- **Requirements are grounded in evidence.** Every requirement should trace back to customer signal, competitive pattern, or system constraint — not just PM intuition.

---

## Alternative Exits

Not every shaping session ends with a spec. At any phase transition, offer the appropriate next step:

| Signal | Offer |
|--------|-------|
| Spec is shaped and validated | → Done. Offer docx conversion. |
| Need to test the shape with customers | → Prototyping agent (quick HTML validation prototype) |
| Shape is validated, ready to build | → Prototyping agent (full-stack MVP) |
| Need deeper domain understanding | → Loop back to Phase 2 (domain learning stream) |
| Research reveals the idea is weak | → Close honestly. Save to `ideas/` with status `rejected` and the evidence. |

---

## When to Skip Phases

- **User arrives with strong evidence and competitive context** → Skip Phase 2, go straight to Phase 3 (Shape). Feed evidence directly to Spec Writer.
- **Problem is well-understood, need to audit the codebase** → Run only system audit from Phase 2, then shape.
- **Small bet or quality-of-life fix** → Compress into a single conversation: fast triage → immediate spec. Don't force a heavy process on a lightweight decision.
- **User already ran triage in a previous session** → Load the triage file from `ideas/`, skip Phase 1, pick up at Phase 2 or 3.

### Handling missing artifacts from skipped phases

When the user enters mid-pipeline, earlier phases didn't produce their artifacts:

- **Skipping Phase 1 (entering at Phase 2):** Do a compressed inline triage — 2–3 sentences capturing core behavior change, key assumption, and strategic leverage. Don't run the full Idea Triage agent. Save this as a note at the top of the first research file so Phase 3 has context.
- **Skipping Phases 1–2 (entering at Phase 3):** The Spec Writer's brainstorm mode probes on problem framing, so it covers the triage gap naturally. Note to the user that if the brainstorm surfaces questions needing competitive context or customer evidence, they can loop back to Phase 2.
- **Skipping to Prototyping:** No pipeline context needed. The Prototyping agent handles its own intake.

---

## Principles

- **This is a conversation, not a template.** Adapt to where the user is. Skip what they don't need. Spend time where uncertainty is highest.
- **Push for simplicity.** If a design takes more than 2 sentences to explain, it's too complex.
- **Surface trade-offs.** Have a recommendation and defend it.
- **Question scope.** Every requirement earns its place. No evidence? Push back.
- **Every phase produces artifacts.** The user should always have something tangible — triage file, research docs, spec draft — to reference later or hand off to someone else.
- **Don't auto-advance.** Offer the next phase at each transition, but let the user decide when to move forward.
