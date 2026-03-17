import { loadAgent, LoadedPrompt } from "./promptLoader";

export interface RoutingResult {
  agentId: string;
  phase?: "triage" | "research" | "shape";
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

// Intent signals mapped to agents and pipeline phases
const ROUTING_RULES: Array<{
  patterns: RegExp[];
  agentId: string;
  phase?: "triage" | "research" | "shape";
  description: string;
}> = [
  // Non-product-idea tasks route directly to agents (Rule 1)
  {
    patterns: [
      /analyz[ei]\s+(transcript|interview|customer\s+req|feedback)/i,
      /research\s+(plan|study|discussion\s+guide)/i,
      /JTBD|jobs?\s+to\s+be\s+done/i,
    ],
    agentId: "user-research",
    description: "Research/analysis task",
  },
  {
    patterns: [
      /brain\s*dump/i,
      /messy\s+notes/i,
      /make\s+sense\s+of/i,
      /structure\s+(my|these|the)\s+(thoughts|notes|ideas)/i,
    ],
    agentId: "brain-dump",
    description: "Structure unstructured thinking",
  },
  {
    patterns: [
      /action\s*items/i,
      /daily\s+summary/i,
      /what.*do\s+I\s+(need|have)\s+to/i,
    ],
    agentId: "action-items",
    description: "Action item extraction",
  },
  {
    patterns: [
      /build\s+(a\s+)?prototype/i,
      /quick\s+html/i,
      /clickable/i,
      /make\s+(this|it)\s+deployable/i,
      /mvp/i,
    ],
    agentId: "prototyping-agent",
    description: "Build a prototype",
  },

  // Product idea lifecycle routing (Rule 2)
  // Has evidence, needs a spec
  {
    patterns: [
      /write\s+(a\s+)?spec/i,
      /brainstorm\s+(a\s+)?spec/i,
      /need\s+a\s+spec/i,
      /epic\s+spec/i,
      /one[- ]pager/i,
      /PRD/i,
    ],
    agentId: "spec-writer",
    phase: "shape",
    description: "Spec writing",
  },
  // Has conviction, needs evidence
  {
    patterns: [
      /how\s+do\s+competitors/i,
      /competitive\s+(research|analysis)/i,
      /scope\s+(out|this)/i,
      /what.*market\s+doing/i,
    ],
    agentId: "idea-triage",
    phase: "research",
    description: "Scoping with research needed",
  },
  // Vague / exploratory — triage
  {
    patterns: [
      /i\s+ha(ve|d)\s+(this\s+|an?\s+)?idea/i,
      /what\s+if\s+we/i,
      /should\s+we\s+build/i,
      /is\s+(this|it)\s+worth/i,
      /triage/i,
      /shape\s+(this|a)/i,
      /new\s+feature/i,
    ],
    agentId: "idea-triage",
    phase: "triage",
    description: "Idea needs triage",
  },
];

/**
 * Classify user intent and determine which agent to route to.
 * Returns routing result with agent ID, optional pipeline phase,
 * and confidence level.
 */
export function classifyIntent(message: string): RoutingResult {
  const normalizedMessage = message.trim();

  for (const rule of ROUTING_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(normalizedMessage)) {
        return {
          agentId: rule.agentId,
          phase: rule.phase,
          confidence: "high",
          reasoning: rule.description,
        };
      }
    }
  }

  // Default: if it sounds like a product question, use PM Lead as general PM
  return {
    agentId: "pm-lead",
    confidence: "low",
    reasoning:
      "No strong signal detected — routing to PM Lead for general handling",
  };
}

/**
 * Build a routing preamble that tells the LLM which agent was selected and why.
 * This is prepended to the user message as context for the LLM.
 */
export function buildRoutingContext(result: RoutingResult): string {
  let context = `[Agent activated: ${result.agentId}`;
  if (result.phase) {
    context += ` | Pipeline phase: ${result.phase}`;
  }
  context += ` | Reason: ${result.reasoning}]`;
  return context;
}
