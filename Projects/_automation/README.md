# Project Automation Setup

This folder contains automation scripts to help organize your projects.

## Scripts

| Script | Purpose |
|--------|---------|
| `run_daily.py` | Main entry point - runs all automation tasks |
| `document_sorter.py` | Sorts new documents into projects based on content |
| `message_extractor.py` | Extracts emails/Teams messages into projects |
| `project_classifier.py` | Core classification logic |

## Setup

### 1. Install Dependencies

```powershell
cd "C:\Users\mhetrick\OneDrive - Microsoft\Projects\_automation"
pip install -r requirements.txt
```

### 2. Test Document Sorting

```powershell
# Dry run - see what would happen
python document_sorter.py --dry-run

# Actual run
python document_sorter.py
```

### 3. Configure Email/Teams (Optional)

To enable email and Teams message extraction:

1. **Register an Azure AD App**
   - Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App Registrations
   - Click "New registration"
   - Name: "Project Automation"
   - Redirect URI: Public client/native, `http://localhost`

2. **Add API Permissions**
   - Microsoft Graph → Delegated permissions:
     - `Mail.Read`
     - `Chat.Read`
     - `User.Read`
   - Click "Grant admin consent"

3. **Update config.yaml**
   ```yaml
   graph_api:
     enabled: true
     tenant_id: "your-tenant-id"
     client_id: "your-app-client-id"
   ```

4. **Test**
   ```powershell
   python message_extractor.py --dry-run
   ```

### 4. Schedule Daily Run

Use Windows Task Scheduler:

1. Open Task Scheduler
2. Create Task → "Project Automation Daily"
3. Trigger: Daily at end of work (e.g., 5:00 PM)
4. Action: Start a program
   - Program: `python`
   - Arguments: `"C:\Users\mhetrick\OneDrive - Microsoft\Projects\_automation\run_daily.py"`
   - Start in: `C:\Users\mhetrick\OneDrive - Microsoft\Projects\_automation`

Or create a scheduled task via PowerShell:

```powershell
$Action = New-ScheduledTaskAction -Execute "python" -Argument '"C:\Users\mhetrick\OneDrive - Microsoft\Projects\_automation\run_daily.py"' -WorkingDirectory 'C:\Users\mhetrick\OneDrive - Microsoft\Projects\_automation'
$Trigger = New-ScheduledTaskTrigger -Daily -At 5pm
Register-ScheduledTask -TaskName "ProjectAutomation" -Action $Action -Trigger $Trigger -Description "Daily project document sorting"
```

## How Classification Works

The classifier reads each project's `manifest.yaml` and extracts:
- Project name and description
- Tags
- Keywords from OKRs
- GitHub repo names
- Related terms

When processing a document, it:
1. Extracts text content (supports .docx, .pptx, .xlsx, .pdf, .md, .txt)
2. Matches against project keywords using fuzzy matching
3. Calculates a confidence score (0-1)
4. If confidence ≥ 0.3, sorts to that project
5. Otherwise, puts in `_needs-sorting` folder

## Improving Classification

To improve sorting accuracy for a project:

1. **Add more tags** in `manifest.yaml`:
   ```yaml
   tags:
     - "intelligent-monitors"
     - "brain-monitors"
     - "extensible-contract"
   ```

2. **Add detailed OKRs** - terms from OKRs are used for matching

3. **Use consistent naming** - include project keywords in document names

## Files Created

- `processed.log` - Tracks which files have been processed (to avoid duplicates)
- `_needs-sorting/` - Documents that couldn't be classified
- `_needs-sorting/messages/` - Emails/Teams messages that couldn't be classified
