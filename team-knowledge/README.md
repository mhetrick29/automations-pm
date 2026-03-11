# Team Knowledge

This folder is the **shared knowledge layer** for all agents. Everything here is automatically read by agents when they start up, giving them context about your team, product, and working style.

## What to Put Here

Add your team's foundational documents — anything you'd want a new team member to read in their first week:

| What | Examples | Why agents need it |
|------|----------|-------------------|
| **Product/domain docs** | Vision docs, architecture overviews, domain glossaries | So agents understand what your product does and use correct terminology |
| **Team structure** | Org charts, ownership models, team responsibilities | So agents know who owns what and can reference the right teams |
| **Process docs** | Sprint process, design review process, release lifecycle | So specs and plans follow your team's actual workflow |
| **Priorities** | Current roadmap, quarterly priorities, OKRs | So agents can contextualize work relative to what matters now |
| **Writing conventions** | Style guides, document templates, tone guidelines | So agent output matches your team's voice |

## Folder Structure

```
team-knowledge/
  config.yaml                    # Knowledge sync config (optional)
  writing-style-guide.md         # Team writing conventions
  writing-styles/
    example-style.md             # Example personal style (see pattern)
    [your-name]-style.md         # Add your own!
  product-context/
    README.md                    # Guide for what goes here
    [your-docs].md               # Your product vision, priorities, etc.
```

## Tips

- **Start small.** Even a single paragraph about your product helps agents enormously. You can add more docs over time.
- **Markdown preferred.** Agents read `.md` files directly. Use `node tools/read-doc.js` to convert `.docx`/`.pptx` to text if needed.
- **Keep it current.** Outdated context is worse than no context. Update these when priorities shift.
- **Agents read everything.** Every `.md` file in this folder and subfolders is fair game. Don't put sensitive credentials here.
