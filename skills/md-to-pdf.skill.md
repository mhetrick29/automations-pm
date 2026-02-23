# Skill: Convert Markdown to PDF

## When to Use
User asks to:
- Convert a `.md` file to PDF
- Export markdown as PDF
- Generate a PDF from markdown
- "Make this a PDF"
- "Make me a PDF about/of [topic]"
- "Generate a PDF on [topic]"

## Automatic Workflow

When user asks for a PDF on a topic (not an existing file):

1. **Generate the markdown file**
   - Create a well-structured `.md` file
   - Use proper headings, tables, lists for good PDF rendering
   - Save to the user's Downloads folder: `$HOME\Downloads\<topic-slug>.md`

2. **Convert to PDF**
   ```powershell
   md-to-pdf "$HOME\Downloads\<topic-slug>.md"
   ```
   Output PDF is created in the same directory (Downloads).

3. **Report the output path** to the user

### Example Flow
User: "Make me a PDF about intelligent monitors"

→ Create: `~/Downloads/intelligent-monitors.md`
→ Run: `md-to-pdf "$HOME\Downloads\intelligent-monitors.md"`
→ Tell user: "Created intelligent-monitors.pdf in your Downloads folder"

## Prerequisites
- **Node.js** must be installed
- **md-to-pdf**: `npm install -g md-to-pdf`

## Usage

### Basic Conversion
```powershell
md-to-pdf "<input.md>"
```
Output: `<input>.pdf` in the same directory

### Convert Existing File
```powershell
md-to-pdf "C:\path\to\file.md"
```

### With Custom Output Path
```powershell
md-to-pdf "<input.md>" --as-html  # outputs HTML instead
```

## Error Handling

| Error | Solution |
|-------|----------|
| `md-to-pdf: command not found` | Run `npm install -g md-to-pdf` |
| Puppeteer/Chrome errors | May need to run `npx puppeteer browsers install chrome` |

## Notes
- Output PDF is placed in the same directory as the source markdown file
- Uses Puppeteer/Chrome under the hood—no LaTeX required
- Renders tables, code blocks, and images well
- Supports CSS styling via frontmatter if needed
