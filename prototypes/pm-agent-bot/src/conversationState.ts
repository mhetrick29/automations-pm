import { ChatCompletionMessageParam } from "openai/resources";

export interface ThreadState {
  agentId: string;
  messages: ChatCompletionMessageParam[];
  createdAt: number;
  lastActivity: number;
}

/**
 * In-memory conversation state manager.
 * Tracks per-thread state: which agent is active, conversation history.
 *
 * V1: in-memory with TTL cleanup.
 * V2: Azure Table Storage for persistence across restarts.
 */
export class ConversationStateManager {
  private threads: Map<string, ThreadState> = new Map();
  private readonly TTL_MS = 60 * 60 * 1000; // 1 hour

  /**
   * Get or create state for a conversation thread.
   */
  getThread(threadId: string): ThreadState | undefined {
    const state = this.threads.get(threadId);
    if (state) {
      state.lastActivity = Date.now();
    }
    return state;
  }

  /**
   * Create a new thread with the given agent.
   */
  createThread(threadId: string, agentId: string): ThreadState {
    const state: ThreadState = {
      agentId,
      messages: [],
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };
    this.threads.set(threadId, state);
    return state;
  }

  /**
   * Add a user message to the thread.
   */
  addUserMessage(threadId: string, content: string): void {
    const state = this.threads.get(threadId);
    if (state) {
      state.messages.push({ role: "user", content });
      state.lastActivity = Date.now();
      this.trimHistory(state);
    }
  }

  /**
   * Add an assistant message to the thread.
   */
  addAssistantMessage(threadId: string, content: string): void {
    const state = this.threads.get(threadId);
    if (state) {
      state.messages.push({ role: "assistant", content });
      state.lastActivity = Date.now();
      this.trimHistory(state);
    }
  }

  /**
   * Keep conversation history manageable.
   * Retain the last 20 messages to stay within token budget.
   */
  private trimHistory(state: ThreadState): void {
    const MAX_MESSAGES = 20;
    if (state.messages.length > MAX_MESSAGES) {
      state.messages = state.messages.slice(-MAX_MESSAGES);
    }
  }

  /**
   * Clean up expired threads.
   */
  cleanup(): void {
    const now = Date.now();
    for (const [id, state] of this.threads) {
      if (now - state.lastActivity > this.TTL_MS) {
        this.threads.delete(id);
      }
    }
  }

  /**
   * Get stats for debugging.
   */
  stats(): { activeThreads: number } {
    return { activeThreads: this.threads.size };
  }
}
