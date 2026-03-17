import {
  CloudAdapter,
  ConfigurationBotFrameworkAuthentication,
  TurnContext,
  ActivityTypes,
  Channels,
} from "botbuilder";
import * as restify from "restify";
import * as dotenv from "dotenv";
import * as path from "path";

import { loadAgent } from "./promptLoader";
import { classifyIntent, buildRoutingContext } from "./router";
import { AgentOpenAIClient, OpenAIClientConfig } from "./openaiClient";
import { TOOL_DEFINITIONS, executeTool } from "./tools";
import { ConversationStateManager } from "./conversationState";

dotenv.config();

// --- Configuration ---

const PORT = process.env.PORT || 3978;
const AGENTS_ROOT = path.resolve(
  __dirname,
  "..",
  process.env.AGENTS_ROOT || "../../agents"
);
const SKILLS_ROOT = path.resolve(
  __dirname,
  "..",
  process.env.SKILLS_ROOT || "../../skills"
);
const KNOWLEDGE_ROOT = path.resolve(
  __dirname,
  "..",
  process.env.TEAM_KNOWLEDGE_ROOT || "../../team-knowledge"
);

const openaiConfig: OpenAIClientConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o",
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-12-01-preview",
};

// --- Initialize components ---

const openaiClient = new AgentOpenAIClient(openaiConfig);
const stateManager = new ConversationStateManager();

// Cleanup expired threads every 15 minutes
setInterval(() => stateManager.cleanup(), 15 * 60 * 1000);

// Bot Framework authentication
const botFrameworkAuth = new ConfigurationBotFrameworkAuthentication({
  MicrosoftAppId: process.env.BOT_ID || "",
  MicrosoftAppPassword: process.env.BOT_PASSWORD || "",
});

const adapter = new CloudAdapter(botFrameworkAuth);

// Error handler
adapter.onTurnError = async (context: TurnContext, error: Error) => {
  console.error(`[Bot Error] ${error.message}`);
  console.error(error.stack);
  await context.sendActivity(
    `Something went wrong: ${error.message}. Try again or rephrase your request.`
  );
};

// --- Bot message handler ---

async function handleMessage(context: TurnContext): Promise<void> {
  if (context.activity.type !== ActivityTypes.Message) return;

  const userMessage = context.activity.text?.trim();
  if (!userMessage) return;

  // Strip bot @mention from the message
  const cleanMessage = removeBotMention(userMessage, context);

  // Determine thread ID for conversation state
  const threadId = getThreadId(context);

  // Check for existing conversation in this thread
  let threadState = stateManager.getThread(threadId);
  let agentId: string;

  if (threadState) {
    // Existing conversation — continue with the same agent
    agentId = threadState.agentId;
    stateManager.addUserMessage(threadId, cleanMessage);
  } else {
    // New conversation — classify intent and route
    const routing = classifyIntent(cleanMessage);
    agentId = routing.agentId;
    threadState = stateManager.createThread(threadId, agentId);
    stateManager.addUserMessage(threadId, cleanMessage);

    console.log(
      `[Route] "${cleanMessage.substring(0, 50)}..." → ${agentId} (${routing.confidence})`
    );
  }

  // Show typing indicator
  await context.sendActivity({ type: ActivityTypes.Typing });

  try {
    // Load the agent's system prompt + skills
    const loadedPrompt = loadAgent(
      agentId,
      AGENTS_ROOT,
      SKILLS_ROOT,
      KNOWLEDGE_ROOT
    );

    // Add Teams-specific context to the system prompt
    const teamsContext = buildTeamsContext(context);
    const fullSystemPrompt = `${loadedPrompt.systemPrompt}\n\n${teamsContext}`;

    // Call Azure OpenAI with the agent's prompt, conversation history, and tools
    const response = await openaiClient.chat(
      fullSystemPrompt,
      threadState.messages,
      TOOL_DEFINITIONS,
      executeTool
    );

    // Save assistant response to conversation state
    stateManager.addAssistantMessage(threadId, response.content);

    // Send response back to Teams
    // Split long responses into chunks if needed (Teams has a 28KB message limit)
    const chunks = splitMessage(response.content, 4000);
    for (const chunk of chunks) {
      await context.sendActivity(chunk);
    }

    // Log tool usage for debugging
    if (response.toolCalls && response.toolCalls.length > 0) {
      console.log(
        `[Tools] ${response.toolCalls.map((t) => t.name).join(", ")}`
      );
    }
  } catch (err) {
    console.error(`[Agent Error] ${err instanceof Error ? err.message : err}`);
    await context.sendActivity(
      `I had trouble processing that. Error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}

// --- Helper functions ---

/**
 * Remove the @mention of the bot from the message text.
 */
function removeBotMention(text: string, context: TurnContext): string {
  const mentions = TurnContext.removeMentionText(
    context.activity,
    context.activity.recipient.id
  );
  return (mentions || text).trim();
}

/**
 * Build a unique thread ID from the conversation context.
 * In Teams, replies in a thread share the same conversation ID + reply chain.
 */
function getThreadId(context: TurnContext): string {
  const conversationId = context.activity.conversation.id;
  // If this is a reply in a thread, use the thread ID
  const replyToId = context.activity.replyToId;
  return replyToId ? `${conversationId}:${replyToId}` : conversationId;
}

/**
 * Build additional context about the Teams environment.
 */
function buildTeamsContext(context: TurnContext): string {
  const userName =
    context.activity.from?.name || "Unknown user";
  const channelId = context.activity.channelId;
  const isTeams = channelId === Channels.Msteams;

  return [
    "--- RUNTIME CONTEXT ---",
    `User: ${userName}`,
    `Platform: ${isTeams ? "Microsoft Teams" : channelId}`,
    "Output format: Keep responses concise for chat. Use markdown formatting.",
    "When saving files, use the save_to_repo tool.",
    "When querying ADO work items, use the search_work_items or get_work_item tools.",
    "When asked about meetings or calendar, use the ask_about_meetings tool.",
  ].join("\n");
}

/**
 * Split a long message into chunks that fit within Teams' limits.
 */
function splitMessage(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      chunks.push(remaining);
      break;
    }

    // Find a good break point (paragraph, sentence, or word boundary)
    let breakPoint = remaining.lastIndexOf("\n\n", maxLength);
    if (breakPoint < maxLength * 0.5) {
      breakPoint = remaining.lastIndexOf(". ", maxLength);
    }
    if (breakPoint < maxLength * 0.5) {
      breakPoint = remaining.lastIndexOf(" ", maxLength);
    }
    if (breakPoint < 0) {
      breakPoint = maxLength;
    }

    chunks.push(remaining.substring(0, breakPoint + 1));
    remaining = remaining.substring(breakPoint + 1).trim();
  }

  return chunks;
}

// --- Start server ---

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post("/api/messages", async (req, res) => {
  await adapter.process(req, res, async (context) => {
    await handleMessage(context);
  });
});

server.listen(PORT, () => {
  console.log(`\n🤖 PM Agent Bot listening on port ${PORT}`);
  console.log(`   POST /api/messages`);
  console.log(`   Agents root: ${AGENTS_ROOT}`);
  console.log(`   Skills root: ${SKILLS_ROOT}`);
  console.log(`   Knowledge root: ${KNOWLEDGE_ROOT}`);
  console.log(`   OpenAI deployment: ${openaiConfig.deployment}`);
  console.log(`   Threads active: ${stateManager.stats().activeThreads}`);
});
