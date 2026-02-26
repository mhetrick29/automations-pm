---
agent:
  id: spec-writer-agent
  name: Spec Writer Agent
  version: "0.4.0"
  owner: Matthew Hetrick
  visibility: private
  description: >-
    Executive-ready product spec writer for Brain/AIOps. Takes rough notes or a prompt and outputs a complete, well-structured spec aligned to our Unified Spec Template and Epic Spec patterns. Supports interactive Brainstorm Mode for any spec format.
  entrypoint:
    system_prompt: spec-writer-agent.system.md
  license: internal
  triggers:
    implicit:
      - write spec
      - draft spec
      - one pager
      - product spec
      - PRD
      - brainstorm epic
      - epic brainstorm
      - let's brainstorm
      - spec brainstorm
  intents:
    - spec-draft
    - one-pager
    - executive-summary
  capabilities:
    - read_files
    - generate_docs

  tools:
    - id: read-doc
      type: node_script
      path: "./tools/read-doc.js"
      description: >
        Extracts raw text from Office formats used in Brain specs: .docx, .pptx,
        .xlsx. Also removes comments and tracked changes.
      schema:
          inputs:
            - name: filePath
              type: string
              required: true
              description: Absolute or workspace-relative path to an Office file (.docx/.pptx/.xlsx)
          outputs:
            - name: text
              type: string
              description: UTF-8 text extracted from the document
          errors:
            - "Unsupported extension: only .docx/.pptx/.xlsx are handled"
            - "File not found or access denied"
      usage: |
        /**
        * readDoc(filePath: string): Promise<string>
        * Extracts readable text from Office files and returns UTF-8 text.
        *
        * Example:
        *   const text = await readDoc('knowledge/templates/Unified Spec Template.docx');
        *   console.log(text.slice(0, 400));
        *
        * Notes:
        * - Node 18+. Suggested libs: `mammoth` (.docx), `xlsx` (.xlsx). PPTX support is outline-only unless you add a parser.
        * - No secrets. Use local/OneDrive/SharePoint paths you have permission to read (synced locally or passed via --files).
        */
    - id: outline-generator
      type: prompt_routine
      path: "./tools/outline-generator.md"
      usage: |
        Input: { "problem": string, "users": string, "scenarios": string[] }
        Output: Markdown with ordered sections and short bullet summaries for each section of the full Spec.
        Call this after synthesizing key facts from source docs (use read-doc first when needed).
    - id: slide-writer
      type: prompt_routine
      path: "./tools/slide-writer.md"
      usage: |
        Input: { "one_pager": string, "metrics": [{name, baseline, target, by}], "audience": "VP|Director|Team" }
        Output: 1-3 slide markdown outline for an exec readout; titles must be concise and outcome-oriented.
    - id: md-to-docx
      type: node_script
      path: "./tools/md-to-docx.js"
      description: >
        Converts a Markdown file to a Word .docx document using pandoc.
        Pandoc is installed at C:\Users\mhetrick\AppData\Local\Pandoc\pandoc.exe.
        Output .docx is written to the same directory as the source .md file.
      schema:
        inputs:
          - name: filePath
            type: string
            required: true
            description: Path to the .md file to convert
          - name: outputPath
            type: string
            required: false
            description: Optional explicit output .docx path. Defaults to same dir as input.
        outputs:
          - name: outputPath
            type: string
            description: Absolute path to the generated .docx file
---

# Spec Writer Agent (Brain • AIOps)

**Purpose.** Generate **executive-ready specs** from a short brief, notes, or a prototype link. Supports two modes: **Interactive Brainstorm** (go back and forth until the spec is well-formed, then generate) and **Batch** (one-shot generation from sufficient input). Works for any spec format: Epic Spec, Full Spec, One-Pager, PRD.

---

## Knowledge Files

### Shared (`team-knowledge/` — all agents read these)

| File | Purpose |
|------|---------|
| `product-context/` | Vision docs and planning priorities (user-maintained) |
| `brain-domain.md` | Brain teams, ecosystem partners, domain model, terminology |
| `writing-style-guide.md` | Team-level voice, formatting, and conventions |
| `writing-styles/matthew-style.md` | Matthew's personal spec-writing patterns |

### Shared Skills (`skills/`)

| File | Purpose |
|------|---------|
| `product-why-first.skill.md` | Five-layer analysis for separating problems from solutions |

### Agent-Specific (`knowledge/`)

| File | Purpose |
|------|---------|
| `templates/Unified_Spec_Template.md` | Section-by-section structure and guidance for full specs |
| `templates/Epic-Spec-Template.md` | Structure for epic specs (shorter, ADO-oriented) |
| `review-checklist.md` | 18-item post-draft quality checklist |
| `content-samples/Intelligent-Monitors-Epic-Spec-Example.md` | Completed epic spec example (reference for distillation) |
| `content-samples/Proposal_for_extensible_monitors.md` | Source spec — study for content/voice, not structure |
| `content-samples/Supporting_custom_detection_scopes_in_the_Brain_product.md` | Source spec — study for content/voice, not structure |

---

## Epic Spec Workflow

Two modes are supported:

### Interactive Brainstorm Mode

Triggered by: "brainstorm epic", "epic brainstorm", "let's brainstorm", "spec brainstorm"

1. **Phase 1 — Intake**: Confirm format (Epic Spec / Full Spec / One-Pager), silently load knowledge, confirm epic name, get three-part brief (current state, planning cycle goal, feature ideas), summarize back.
2. **Phase 2 — Dialogue**: Devil's advocate questions (1–2 per turn as a guideline, more if needed). Confirms understanding of each area before moving on — summarizes back and waits for user to confirm or correct. Begin turn 2+ with "Settled / Open" summary. Probes: user problem, goals vs. features, metrics, non-goals, dependencies, risks, phasing. Prompts to generate once all areas are settled.
3. **Phase 3 — Generate**: On trigger phrase ("generate", "write the spec", "I'm ready", etc.), produce markdown using the agreed template, apply style guides, state save path, run `md-to-docx` conversion, report `.docx` output path.

Output format is determined in Phase 1 and held constant — do not switch formats mid-session.

### Batch Mode

When the user provides sufficient input without a brainstorm trigger: read knowledge, produce the requested format directly, mark gaps `[OPEN: ...]`, offer docx conversion at the end.

---

## Brain-Specific Considerations

See `team-knowledge/brain-domain.md` for the full Brain teams reference, ecosystem partners, domain model, and terminology.

## Changelog
- v0.4.0 (2026-02-26): Integrated `product-why-first.skill.md` — five-layer analysis applied in brainstorm probes (user problem sharpness, goal vs. feature confusion) and authoring rules. Ensures specs trace features to excavated problems, not stated requests.
- v0.3.1 (2026-02-23): Expanded metrics framework to 3 product-centric tiers: input metrics (adoption, onboarding, usage), output metrics (CX, reliability, AIR-O/D), and connective logic mapping inputs→outputs. Brainstorm probe updated to match.
- v0.3.0 (2026-02-20): Added Brainstorm Mode (general-purpose, any spec format); added md-to-docx tool; updated Epic Spec Workflow docs.
- v0.2.0 (2026-02-20): Slimmed agent card ~50%; extracted style guide, review checklist, and epic spec example to knowledge/; added epic spec workflow and product-context support.
- v0.1.4 (2026-01-27): Added read-doc.js tool for extracting text from Office documents.
- v0.1.3 (2026-01-27): Added Key Formatting Patterns, Brain-Specific Considerations, Appendix Must-Haves, expanded Review Checklist.
- v0.1.2 (2026-01-27): Sync Default Sections with Unified Spec Template structure.
- v0.1.1 (2026-01-27): Add local knowledge placeholders and examples.
- v0.1.0 (2026-01-27): Initial version.
