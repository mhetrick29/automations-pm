# PM Agent Teams Bot

**Status:** validated
**Date:** 2026-03-17
**Triage by:** Idea Triage Agent
**Validated:** 2026-03-17 — Fake It test (team loved it), WorkIQ transcript probe (works, but returns summary by default — need to force full transcript retrieval)

---

## Raw Idea

Build a Teams bot (Custom Engine Agent via Teams SDK) that surfaces the PM agent stack (PM Lead, Idea Triage, Spec Writer, User Research, Prototyping) inside Microsoft Teams chat. Users @mention the bot in any Teams chat — including meeting chats — and it loads the appropriate agent system prompt, runs a multi-turn conversation via Azure OpenAI, writes output files to the repo, and connects to existing MCP tools (ADO, GitHub). Team-facing — the whole team can use it, not just the person who built the agents.

## Triage Summary

**Core behavior change:** Instead of opening a terminal and running Copilot CLI to interact with PM agents, anyone on the team can @mention the agent in any Teams context and get the same triage/research/spec/prototyping capabilities.

**Simplest interaction loop:** User @mentions bot in Teams chat → bot loads PM Lead routing → classifies intent → runs the right agent → posts responses back in the thread → multi-turn conversation continues.

**Key assumption:** The friction between "I just had an idea in a meeting" and "that idea is now triaged/researched/specced" is what kills ideas. They get mentioned and forgotten. A Teams-native agent solves this at the source.

## Product-Why-First Assessment

- **Root cause vs. symptom:** Root cause. The real problem is context-switching friction and idea decay.
- **Alignment with priorities:** Strong. Force multiplier for the existing agent stack.
- **Minimum testable version:** Tier 1 only — bot in a group chat, text-based, no transcript access.

## Strategic Leverage

- Turns a personal PM toolkit into a **team capability**
- Demo-able, differentiating for the org — "our PM team has an AI agent that triages ideas in real-time"
- Nobody in the org is doing this — concrete AI-augmented PM example for leadership
- Expands agent user base from 1 (you) to the whole team

## 4-Tier Scope Ladder

| Tier | Interaction | Complexity |
|---|---|---|
| 1. Chat responder | @agent in group chat → agent replies | Low |
| 2. Task executor | @agent do X → agent creates ADO items, writes specs | Medium |
| 3. Meeting-aware | @agent after meeting → reads recap/transcript | Medium-high |
| 4. Meeting participant | Agent is "in" the meeting, answers in real-time | High |

## Validation Approaches

### 1. Fake It in a Group Chat (Recommended first)
- **Format:** Manual proxy — you play the bot for 1 week
- **What it tests:** Whether the team actually @mentions an agent and uses the output
- **Effort:** 0 setup
- **Success signal:** 3+ team members use it unprompted by end of week

### 2. Quick HTML Chat Prototype
- **Format:** Mock Teams chat UI via prototyping agent (Mode 1)
- **What it tests:** Whether the interaction pattern feels natural
- **Effort:** ~1 hour
- **Success signal:** Team says "I would use this"

### 3. Minimal Teams Bot (Tier 1 build)
- **Format:** Teams SDK bot, PM Lead prompt, Azure OpenAI, conversation only
- **What it tests:** End-to-end infrastructure + real usage patterns
- **Effort:** ~1.5 days
- **Success signal:** Successful multi-turn triage in a Teams thread

### 4. WorkIQ Transcript Probe
- **Format:** Test if WorkIQ MCP can pull meeting recaps
- **What it tests:** Whether Tier 3's hardest dependency is actually hard
- **Effort:** 30 minutes
- **Success signal:** WorkIQ returns usable transcript/recap content

### 5. Dogfood in Next Team Meeting (Passive)
- **Format:** Triage an idea live in the meeting chat using approach #1
- **What it tests:** Whether real-time idea capture adds value or feels disruptive
- **Effort:** 0
- **Success signal:** Someone references the triage output later

**Recommended path:** #1 (Fake It) this week + #4 (WorkIQ probe) in parallel. If positive signal, build #3 (Minimal Tier 1 bot).
