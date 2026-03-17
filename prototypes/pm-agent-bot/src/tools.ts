import { ChatCompletionTool } from "openai/resources";

/**
 * Tool definitions exposed to Azure OpenAI as function calling tools.
 * These bridge the bot to the same capabilities available via MCP in the CLI.
 *
 * V1 scope: ADO work item queries + WorkIQ meeting questions.
 * GitHub and file-output tools can be added incrementally.
 */

export const TOOL_DEFINITIONS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_work_items",
      description:
        "Search Azure DevOps work items by text query. Returns matching work items with ID, title, state, type, and assigned to.",
      parameters: {
        type: "object",
        properties: {
          searchText: {
            type: "string",
            description: "Search text to find work items",
          },
          workItemType: {
            type: "array",
            items: { type: "string" },
            description: "Filter by work item types (e.g., ['Feature', 'Bug'])",
          },
          state: {
            type: "array",
            items: { type: "string" },
            description: "Filter by states (e.g., ['Active', 'New'])",
          },
          top: {
            type: "number",
            description: "Max results to return (default 10)",
          },
        },
        required: ["searchText"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_work_item",
      description:
        "Get a single Azure DevOps work item by ID with all fields.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "Work item ID",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_work_items",
      description:
        "Get work items assigned to the current user. Returns active items by default.",
      parameters: {
        type: "object",
        properties: {
          includeCompleted: {
            type: "boolean",
            description: "Include completed work items (default false)",
          },
          top: {
            type: "number",
            description: "Max results (default 20)",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "ask_about_meetings",
      description:
        "Ask a question about recent meetings, emails, or calendar events using Microsoft 365 data. Can retrieve meeting recaps, action items, and discussion topics.",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "Natural language question about meetings, email, or calendar (e.g., 'What was discussed in yesterday's team meeting?', 'What meetings do I have today?')",
          },
        },
        required: ["question"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "save_to_repo",
      description:
        "Save a markdown file to the PM agent repository. Use for saving triage files, research, or spec drafts.",
      parameters: {
        type: "object",
        properties: {
          filePath: {
            type: "string",
            description:
              "Relative path in the repo (e.g., 'ideas/my-idea-2026-03-17.md')",
          },
          content: {
            type: "string",
            description: "Markdown content to write",
          },
          commitMessage: {
            type: "string",
            description: "Git commit message",
          },
        },
        required: ["filePath", "content", "commitMessage"],
      },
    },
  },
];

/**
 * Execute a tool call. In V1, these are stub implementations
 * that will be wired to real MCP servers or APIs.
 *
 * For initial testing, they return mock data. Replace with real
 * implementations when deploying.
 */
export async function executeTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "search_work_items":
      return await searchWorkItems(args);
    case "get_work_item":
      return await getWorkItem(args);
    case "get_my_work_items":
      return await getMyWorkItems(args);
    case "ask_about_meetings":
      return await askAboutMeetings(args);
    case "save_to_repo":
      return await saveToRepo(args);
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

// --- Tool implementations ---
// These are stubs for V1. Each one should be replaced with actual
// API calls to ADO, WorkIQ, and Git when deploying.

async function searchWorkItems(
  args: Record<string, unknown>
): Promise<string> {
  // TODO: Replace with real ADO REST API call
  // POST https://almsearch.dev.azure.com/{org}/{project}/_apis/search/workitemsearchresults
  return JSON.stringify({
    _note: "STUB — wire to ADO Search API",
    searchText: args.searchText,
    results: [
      {
        id: 12345,
        title: `[Stub] Work item matching "${args.searchText}"`,
        state: "Active",
        type: "Feature",
        assignedTo: "Matthew Hetrick",
      },
    ],
  });
}

async function getWorkItem(args: Record<string, unknown>): Promise<string> {
  // TODO: Replace with real ADO REST API call
  // GET https://dev.azure.com/{org}/{project}/_apis/wit/workitems/{id}
  return JSON.stringify({
    _note: "STUB — wire to ADO Work Items API",
    id: args.id,
    title: `[Stub] Work item #${args.id}`,
    state: "Active",
    type: "Feature",
    description: "Stub description — replace with real API call",
  });
}

async function getMyWorkItems(
  args: Record<string, unknown>
): Promise<string> {
  // TODO: Replace with real ADO WIQL query
  return JSON.stringify({
    _note: "STUB — wire to ADO WIQL query for assigned items",
    results: [
      { id: 100, title: "[Stub] My work item 1", state: "Active" },
      { id: 101, title: "[Stub] My work item 2", state: "New" },
    ],
  });
}

async function askAboutMeetings(
  args: Record<string, unknown>
): Promise<string> {
  // TODO: Replace with WorkIQ MCP call or Microsoft Graph API
  // Key issue: WorkIQ returns summary by default — need to prompt
  // for full transcript explicitly.
  return JSON.stringify({
    _note:
      "STUB — wire to WorkIQ MCP. Remember: force full transcript, not just summary.",
    question: args.question,
    response:
      "Stub response — replace with real WorkIQ query. When implementing, use a prompt like: 'Give me the FULL transcript of the meeting, not a summary.'",
  });
}

async function saveToRepo(args: Record<string, unknown>): Promise<string> {
  // TODO: Replace with simple-git or GitHub API call
  const filePath = args.filePath as string;
  const content = args.content as string;
  const commitMessage = args.commitMessage as string;

  // For now, just write the file locally
  const fs = await import("fs");
  const path = await import("path");
  const repoRoot = process.env.GIT_REPO_ROOT || "../../";
  const fullPath = path.resolve(__dirname, "..", repoRoot, filePath);

  // Ensure directory exists
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");

  return JSON.stringify({
    success: true,
    filePath,
    fullPath,
    commitMessage,
    _note: "File written locally. Git commit/push not yet implemented.",
  });
}
