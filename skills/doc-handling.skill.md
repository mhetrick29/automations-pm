# Skill: Document Handling

## When to Use

Activate this skill whenever the user or agent needs to:

- **Read** an Office document — `.docx`, `.pptx`, `.xlsx` (or legacy `.doc`, `.ppt`, `.xls`)
- **Convert markdown → Word (.docx)** — for sharing specs, planning docs, or any output that needs to be edited in Word
- **Convert markdown → PDF** — for printing, presenting, or any output that needs to be fixed-layout

This skill also activates automatically when:
- A user says "open this doc", "read this file", "what does this Word doc say"
- A user says "make this a Word doc", "export to docx", "save as Word"
- A user says "make this a PDF", "export to PDF", "generate a PDF about [topic]"

---

## Operation 1: Read an Office Document

**Tool:** `node tools/read-doc.js`  
**Supports:** `.docx`, `.pptx`, `.xlsx`, `.doc`, `.ppt`, `.xls` (both modern ZIP-based and legacy OLE formats)

```powershell
node tools/read-doc.js "path/to/file.docx"
node tools/read-doc.js "path/to/file.docx" 50000   # optional maxChars limit
```

Output is plain text extracted from the document. Use this whenever you need to read the content of an Office file before reasoning over it.

**Notes:**
- Legacy `.doc`/`.ppt` files use COM automation on Windows — they take 60+ seconds; set expectations accordingly
- Output is plain text, not markdown — tables and formatting are flattened

---

## Operation 2: Convert Markdown → Word (.docx)

**Tool:** `node tools/md-to-docx.js`  
**Requires:** [Pandoc](https://pandoc.org/installing.html) installed (`C:\Users\...\AppData\Local\Pandoc\pandoc.exe` or on PATH)

```powershell
node tools/md-to-docx.js "path/to/file.md"                        # output alongside input
node tools/md-to-docx.js "path/to/file.md" "path/to/output.docx"  # explicit output path
```

Use this when producing specs, planning docs, or any document the user needs to edit or share in Word. Pandoc renders markdown pipe tables → Word tables, `**bold**` → Word Bold, `#` headings → Word Heading styles — all Epic Spec Template sections render correctly.

**Workflow when user asks for a Word doc:**
1. Generate or locate the `.md` source file
2. Run `node tools/md-to-docx.js "<path>"` — tell the user: `"Running: node tools/md-to-docx.js \"<path>\""`
3. Report the output `.docx` path

**Error handling:**

| Error | Solution |
|-------|----------|
| `pandoc: command not found` | Install from https://pandoc.org or `winget install JohnMacFarlane.Pandoc` |
| `File not found` | Verify the `.md` path is absolute |

---

## Operation 3: Convert Markdown → PDF

**Tool:** `md-to-pdf` (globally installed npm CLI)  
**Requires:** `npm install -g md-to-pdf` (uses Puppeteer/Chrome under the hood — no LaTeX needed)

```powershell
md-to-pdf "path/to/file.md"                # output PDF alongside input
```

Use this when the user needs a fixed-layout output for print or presentation. Output PDF is created in the same directory as the source `.md` file.

**Workflow when user asks for a PDF on a topic (no existing file):**
1. Generate a well-structured `.md` file — use headings, tables, lists for good rendering
2. Save to `$HOME\Downloads\<topic-slug>.md`
3. Run `md-to-pdf "$HOME\Downloads\<topic-slug>.md"`
4. Report: `"Created <topic-slug>.pdf in your Downloads folder"`

**Workflow when user asks to convert an existing `.md` file:**
1. Run `md-to-pdf "<input.md>"`
2. Report the output path

**Error handling:**

| Error | Solution |
|-------|----------|
| `md-to-pdf: command not found` | `npm install -g md-to-pdf` |
| Puppeteer/Chrome errors | `npx puppeteer browsers install chrome` |

---

## Choosing the Right Format

| User wants to… | Use |
|---|---|
| Edit or share the doc in Word / Teams | `md-to-docx.js` → `.docx` |
| Print or present (fixed layout) | `md-to-pdf` → `.pdf` |
| Read an existing Office file | `read-doc.js` |
| Both Word and PDF | Run both tools on the same `.md` source |
