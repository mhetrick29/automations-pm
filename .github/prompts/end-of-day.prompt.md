# End of Day Summary

Run the end-of-day automation to generate daily project summaries.

## Step 1: Generate Work IQ summaries

```powershell
node "$env:USERPROFILE\OneDrive - Microsoft\Automations\tools\end-of-day.js"
```

## Step 2: Sync ADO work items

For each project that has an ADO tag in its manifest, search for work items with that tag and update the manifest's epics/features/user_stories sections with current state.

Read each project's manifest.yaml to get the `ado.tag` value, then search ADO and update the manifest with the current work items (add new ones, update states, remove completed/deleted ones).

You can also run the sync helper:
```powershell
node "$env:USERPROFILE\OneDrive - Microsoft\Automations\tools\sync-ado.js"
```

## Step 3: Report

After running both steps, report:
1. What daily summaries were generated
2. What ADO changes were synced (new items, state changes, removed items)
