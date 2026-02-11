# Projects

Central hub for all project tracking and organization.

## Quick Commands (ask Copilot)

| Command | What it does |
|---------|--------------|
| **"classify my work"** | Scan today's docs and sort into projects |
| **"sync my ADO work items"** | Update manifests with latest ADO items |
| **"classify this doc: [filename]"** | Classify a specific document |

## Active Projects

| Project | Status | ADO Tag | Description |
|---------|--------|---------|-------------|
| [Intelligent Monitors](./Intelligent%20Monitors/) | 🟢 Active | `UIM` | Evolving BRAIN monitors with extensible contracts |

## Structure

```
Projects/
├── _automation/           # Scripts (don't touch)
├── _templates/            # Templates for new projects
├── _needs-sorting/        # Docs that couldn't be auto-classified
├── _cross-references.yaml # Artifacts spanning multiple projects
└── [Project Name]/
    ├── manifest.yaml      # Project hub - ADO items, links, recordings
    └── documents/         # Project-specific docs
```

## Adding a New Project

1. **Create folder**: `Projects/[Project Name]/`
2. **Copy template**: 
   ```powershell
   cp Projects/_templates/project-manifest.template.yaml "Projects/[Project Name]/manifest.yaml"
   ```
3. **Edit manifest.yaml**:
   - Set `project.name` and `description`
   - Set `ado.tag` to your ADO tag (e.g., "UIM")
   - Add classification keywords to `tags` array
4. **Sync**: Ask Copilot "sync my ADO work items"

## ADO Integration

### Setup
1. Add a unique tag to your ADO work items (e.g., "UIM", "SelfServe")
2. Put the same tag in `manifest.yaml` → `ado.tag`

### New ADO item?
- Just add the project tag to it in ADO
- Ask Copilot "sync my ADO work items" to update manifest

### What syncs
- Epics, Features with ID, title, state, assigned_to

## End-of-Day Workflow

1. Ask: **"classify my work"**
2. Review output:
   - 🟢 High confidence → ready to move
   - ⚪ No match → check `_needs-sorting/` or create new project
