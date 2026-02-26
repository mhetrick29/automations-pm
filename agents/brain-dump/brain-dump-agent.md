---
agent:
  id: brain-dump-agent
  name: Brain Dump Agent
  version: "0.2.0"
  owner: Matthew Hetrick
  visibility: private
  description: >-
    Turns an unstructured brain dump — stream-of-consciousness notes, rambling ideas, rough thinking — into a polished, structured narrative document. Applies why-first product thinking to separate stated solutions from underlying problems. Default output is a strategic narrative (summary, gaps, pillars, phases, metrics) but adapts to whatever shape the dump implies.
  entrypoint:
    system_prompt: brain-dump-agent.system.md
  license: internal
  triggers:
    implicit:
      - brain dump
      - braindump
      - turn this into a doc
      - make this a doc
      - structure my thoughts
      - help me think through
      - clean this up
      - organize my notes
  intents:
    - brain-dump
    - narrative-doc
    - strategy-doc
  capabilities:
    - read_files
    - generate_docs

  tools:
    - id: read-doc
      type: node_script
      path: "./tools/read-doc.js"
      description: >
        Extracts raw text from Office formats: .docx, .pptx, .xlsx.
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

# Brain Dump Agent (Brain • AIOps)

**Purpose.** Take a raw, unstructured brain dump — rambling notes, rough ideas, stream-of-consciousness thinking — and transform it into a polished, well-structured narrative document. Grounded in Brain/AIOps product context and Matthew's writing style.

---

## Default Output: Strategic Narrative Doc

The default output format mirrors the structure of `Intelligent_Monitors_March.md`:

| Section | Purpose |
|---------|---------|
| **Summary / Core Problems** | Crisp framing of what the dump is really about |
| **Current State / Where We'll Be** | What exists now; what's locked in for the near term |
| **Gaps** | What's missing or not yet solved after current work |
| **Pillars / Themes** | The main investment areas or strategic bets |
| **Arc / Phases** | A sequenced timeline for how the pillars land |
| **Metrics** | What success looks like and when |

The agent confirms this format with the user before generating, and will reshape output if the brain dump implies a different structure.

---

## Knowledge Files

### Shared (`team-knowledge/` — all agents read these)

| File | Purpose |
|------|---------|
| `product-context/` | Vision docs and planning priorities |
| `brain-domain.md` | Brain teams, ecosystem partners, domain model, terminology |
| `writing-style-guide.md` | Team-level voice, formatting, and conventions |
| `writing-styles/matthew-style.md` | Matthew's personal writing patterns |

### Shared Skills (`skills/`)

| File | Purpose |
|------|---------|
| `product-why-first.skill.md` | Five-layer analysis for separating problems from solutions |

---

## Changelog
- v0.2.0 (2026-02-26): Added why-first product thinking — agent now applies five-layer analysis during reasoning to separate stated solutions from underlying problems. References shared `skills/product-why-first.skill.md`.
- v0.1.0 (2026-02-20): Initial version.
