# Project Folder Template

When creating a new project, copy this folder structure and customize:

## Folder Structure

```
ProjectName/
├── manifest.yaml          # Project metadata, links, and artifact tracking
├── README.md              # Project overview and quick reference
├── docs/                  # Project documents
│   ├── specs/             # Specifications and requirements
│   ├── designs/           # Design documents and diagrams
│   └── notes/             # Meeting notes and scratchpad
│   └── presentations/     # Slide decks
```

## Using the Manifest

The `manifest.yaml` file is the central hub for tracking:
- **OKRs**: Project objectives and key results
- **ADO Work Items**: Links to epics, features, tasks in Azure DevOps
- **GitHub Repos**: Links to code repositories (can't store locally)
- **External Links**: SharePoint, Teams, wikis, dashboards
- **Recordings**: References to recordings in the central `Recordings/` folder
- **Tags**: For cross-project searching

## Cross-Referencing

Artifacts that span multiple projects:
1. Store the artifact in the most relevant project OR the central folder
2. Add a reference in each project's `manifest.yaml` with the `tags` field
3. Use the `_cross-references.yaml` file in the Projects root to find shared items
