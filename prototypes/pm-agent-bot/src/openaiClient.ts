import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";

export interface AgentResponse {
  content: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, unknown>;
    result: string;
  }>;
}

export interface OpenAIClientConfig {
  endpoint: string;
  apiKey: string;
  deployment: string;
  apiVersion: string;
}

export class AgentOpenAIClient {
  private client: OpenAI;
  private deployment: string;

  constructor(config: OpenAIClientConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: `${config.endpoint}/openai/deployments/${config.deployment}`,
      defaultQuery: { "api-version": config.apiVersion },
      defaultHeaders: { "api-key": config.apiKey },
    });
    this.deployment = config.deployment;
  }

  /**
   * Run a chat completion with the agent's system prompt, conversation history,
   * and available tools. Handles the tool-call loop: if the LLM requests tool
   * calls, execute them and feed results back until we get a final text response.
   */
  async chat(
    systemPrompt: string,
    messages: ChatCompletionMessageParam[],
    tools: ChatCompletionTool[],
    toolExecutor: (name: string, args: Record<string, unknown>) => Promise<string>,
    maxToolRounds: number = 5
  ): Promise<AgentResponse> {
    const allMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];
    const executedToolCalls: AgentResponse["toolCalls"] = [];

    for (let round = 0; round < maxToolRounds; round++) {
      const response = await this.client.chat.completions.create({
        model: this.deployment,
        messages: allMessages,
        tools: tools.length > 0 ? tools : undefined,
        temperature: 0.7,
        max_tokens: 4096,
      });

      const choice = response.choices[0];
      if (!choice) {
        return { content: "No response from the model.", toolCalls: executedToolCalls };
      }

      const message = choice.message;

      // If no tool calls, return the text response
      if (!message.tool_calls || message.tool_calls.length === 0) {
        return {
          content: message.content ?? "",
          toolCalls: executedToolCalls,
        };
      }

      // Process tool calls
      allMessages.push(message as ChatCompletionMessageParam);

      for (const toolCall of message.tool_calls) {
        const fnName = toolCall.function.name;
        let fnArgs: Record<string, unknown>;
        try {
          fnArgs = JSON.parse(toolCall.function.arguments);
        } catch {
          fnArgs = {};
        }

        let result: string;
        try {
          result = await toolExecutor(fnName, fnArgs);
        } catch (err) {
          result = `Error executing ${fnName}: ${err instanceof Error ? err.message : String(err)}`;
        }

        executedToolCalls.push({ name: fnName, arguments: fnArgs, result });

        allMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }
    }

    // If we exhausted tool rounds, return whatever we have
    return {
      content:
        "I've been working through several steps. Let me summarize what I found so far.",
      toolCalls: executedToolCalls,
    };
  }
}
