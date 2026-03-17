# PM Agent Teams Bot

## Version & People
- **Status**: Draft
- **Author(s)**: Matthew Hetrick
- **Links**: [Triage](../ideas/pm-agent-teams-bot-2026-03-17.md), [Agent Repo](https://github.com/azure-core/automations1)

---

## 1) Executive Summary

**Problem:** The PM agent stack (triage, research, spec writing, prototyping) only runs in the Copilot CLI terminal — locked behind a single user. Ideas born in Teams meetings and chats die from context-switching friction: by the time someone opens a terminal, the momentum is gone. Meanwhile, the team can't access the agents at all.

**Proposal:** Build a Teams bot (Custom Engine Agent via Teams SDK) that surfaces the full PM agent stack in any Teams chat. Users @mention the bot, it classifies intent via the PM Lead routing logic, loads the right agent, and runs a multi-turn conversation — triaging ideas, answering questions, querying ADO, and writing output files. The same bot works in team chats, customer-adjacent chats, and post-meeting threads.

**Expected outcomes:**
- Ideas get triaged where they're born — in the meeting chat, not hours later
- The team gets structured product thinking without learning the repo or CLI
- Customer-facing conversations get faster, evidence-grounded responses

**The ask:** ~3 days of build time. Azure OpenAI endpoint, Azure hosting for the bot, Teams app registration.

**TL;DR:** From *"ideas die between the meeting and the terminal"* → to *"@PMAgent triage this — done, saved, ready for spec."*

**Hypothesis:** If we surface the PM agent stack in Teams chat for the PM team, then idea triage rate within 24 hours of meeting will go from ~10% to 60%+, because the Fake It validation showed team members immediately engaged when they could @mention an agent in the chat where the idea was born.

---

## 2) Users & Scenarios

### Personas

| Persona | Description |
|---------|-------------|
| **PM (primary)** | Product managers on the team who have ideas, need triage, write specs, and respond to customer asks |
| **Engineering lead (secondary)** | Participates in meetings where product ideas surface; may ask the agent for context on features, ADO status, or prior decisions |
| **Customer-facing PM (primary)** | Same PMs, but in chats that involve external customer context — needs fast, evidence-grounded responses |

### Scenarios

1. **Meeting idea capture:** During a team meeting, someone proposes a feature idea. A PM @mentions the bot in the meeting chat: *"@PMAgent triage the self-healing alerts idea Matt just described."* The bot runs the Idea Triage agent, asks clarifying questions, and saves the triage to `ideas/`.

2. **Post-meeting research:** After a meeting, a PM @mentions the bot: *"@PMAgent what did the team decide about the Slack integration? Check the meeting recap."* The bot pulls the transcript via WorkIQ and answers.

3. **Customer response:** In a customer-adjacent chat, a PM @mentions the bot: *"@PMAgent what's our current story on multi-signal monitors? Pull from the latest spec."* The bot retrieves context from team knowledge and specs.

4. **Spec kick-off:** A PM @mentions the bot: *"@PMAgent brainstorm a spec for the alert suppression feature."* The bot loads the Spec Writer agent and runs a brainstorm session in the thread.

5. **Quick ADO lookup:** An engineer @mentions the bot: *"@PMAgent what's the status of the IM rollout work items?"* The bot queries ADO via MCP and summarizes.

---

## 3) Problems

### 3.1 External (team-facing) pain

- **Ideas decay between meetings and action.** Good ideas get mentioned in meetings, briefly discussed, and then forgotten because nobody captures them in a structured way in the moment. By the time someone opens the CLI to triage, the context is stale and the energy is gone.
- **Agent stack is single-player.** The PM agents (triage, research, spec writer) only work for the person who built them. The rest of the team gets none of the value. This is a force multiplier that's multiplying by 1.
- **Customer responses require context-gathering.** When a PM needs to answer a customer question in a chat, they have to context-switch to the terminal, load team knowledge, query ADO, and come back with an answer. The latency kills the conversational flow.

### 3.2 Internal (tooling/ops) pain

- **WorkIQ transcript retrieval defaults to summary.** When querying meeting recaps, WorkIQ returns a summary rather than the full transcript. The bot needs the full transcript to answer specific questions about what was discussed. Workaround needed.
- **No multi-user access pattern.** The current system assumes a single user running `copilot` in a terminal with local file access. A Teams bot needs shared state, conversation management, and concurrent access patterns.

---

## 4) Metrics, Goals & Non-Goals

### Goals

| Goal | Why | Target Metric | Priority | By |
|------|-----|---------------|----------|----|
| Ideas born in meetings get triaged in the same meeting | Ideas die from context-switching friction — the gap between meeting and terminal kills momentum | % of meeting-surfaced ideas with a triage file within 24 hours | P0 | V1 + 1 month |
| Team can interact with PM agents without CLI knowledge | Agent stack is single-player; the team gets zero value from agents only one person can access | # of unique team members using the bot per week | P0 | V1 + 2 weeks |
| Customer-facing responses are faster and evidence-grounded | PMs context-switch to terminal to gather context, killing conversational flow in customer chats | Time from customer question to PM response in chat | P1 | V1 + 1 month |
| Meeting transcripts are accessible for post-meeting queries | Decisions and ideas discussed in meetings are unretrievable unless someone took notes | Bot successfully answers transcript-based questions | P1 | V2 |

### Non-Goals

- **Not replacing the CLI workflow.** The terminal experience continues to work for deep work sessions. The Teams bot is an additional surface, not a migration.
- **Not building a general-purpose Teams chatbot.** The bot runs the existing PM agent stack — it doesn't need new agent logic, just a new interface.
- **Not real-time meeting participation in V1.** Tier 4 (agent as meeting participant) is a north star, not a V1 deliverable.
- **Not handling file uploads or document editing in Teams.** Spec output is written to the repo. Users review in their editor, not in Teams.

### Success Metrics

| Metric | Baseline | Target | By | Owner |
|--------|----------|--------|----|-------|
| Team members using bot weekly | 0 | 4+ | V1 + 2 weeks | Matthew |
| Ideas triaged within 24h of meeting | ~10% (manual) | 60%+ | V1 + 1 month | Matthew |
| Multi-turn conversations completed successfully | 0 | 80%+ success rate | V1 + 2 weeks | Matthew |
| Meeting transcript queries answered | 0 | 70%+ useful answer rate | V2 | Matthew |

---

## 6) Proposed Solution

### Overview

A Node.js/TypeScript Teams bot built with the Teams SDK (formerly Teams AI Library), deployed to Azure, that receives @mentions in any Teams chat, classifies intent using the PM Lead routing logic, loads the appropriate agent system prompt, calls Azure OpenAI, and posts responses back to the thread. MCP tools (ADO, GitHub) are wired as function definitions for the LLM.

### Architecture

```
Teams chat (@PMAgent message)
  → Azure Bot Service receives activity
  → Teams SDK bot (Node.js on Azure App Service)
  → Orchestration layer:
      1. Load PM Lead system prompt from repo
      2. Classify intent (lifecycle stage, agent routing)
      3. Load target agent system prompt + referenced skills
      4. Build tool definitions from MCP configs (ADO, GitHub, WorkIQ)
  → Azure OpenAI API call (system prompt + tools + conversation history)
  → Response posted back to Teams thread
  → Multi-turn: thread replies → continue conversation with same agent
```

### Capabilities

| Priority | Capability | User Experience |
|----------|-----------|-----------------|
| P0 | **Chat-based agent interaction** | @mention bot in any Teams chat → multi-turn conversation with the PM agent stack |
| P0 | **Intent classification + agent routing** | Bot loads PM Lead routing logic, classifies intent, activates the right agent — user doesn't need to know agent names |
| P0 | **ADO integration** | Bot queries ADO work items, status, iterations via MCP tools during conversation |
| P1 | **File output to repo** | Triage files, research files, and spec drafts written to the GitHub repo automatically |
| P1 | **Meeting transcript access** | Bot retrieves meeting recaps/transcripts via WorkIQ for post-meeting queries |
| P1 | **Team knowledge access** | Bot loads team-knowledge/ files as context for grounded responses |
| P2 | **Scheduled digests** | Bot posts daily/weekly summaries (open ideas, action items, sprint status) to a channel |

### Phased Approach

#### V1 (MVP) — Chat Responder + Task Executor

**Summary:** The bot runs in any Teams chat, routes intent to the right agent, and supports multi-turn conversations. It can query ADO and write output files to the repo. No transcript access yet.

**Customer gets:**
- @mention the bot in any Teams chat and get a full agent interaction (triage, spec brainstorm, ADO queries, research)
- Multi-turn conversations in threads — the bot maintains context across replies
- Triage files and spec drafts automatically saved to the repo

**Problems solved:**
- Ideas decay → ideas get triaged in the meeting chat where they're born
- Agent stack is single-player → any team member can @mention the bot
- Customer responses need context-gathering → bot pulls from team knowledge and ADO in real-time

**Success criteria:**
- 4+ team members using the bot weekly within 2 weeks
- 80%+ multi-turn conversations complete successfully
- Ideas triaged within 24h goes from ~10% to 60%+

#### V2 — Meeting-Aware

**Summary:** The bot can access meeting transcripts via WorkIQ, enabling post-meeting queries like "what did we decide about X?" and "triage the idea discussed at minute 15."

**Customer gets:**
- @mention the bot after a meeting → it reads the recap/transcript and answers
- Transcript-grounded idea triage — bot extracts the idea from the discussion context
- Decision retrieval — "what was decided about the Slack integration?"

**Problems solved:**
- Meeting transcript access → bot reads the full transcript, not just the summary
- Post-meeting context loss → decisions and ideas are retrievable

**Success criteria:**
- 70%+ transcript-based queries return useful answers
- Full transcript retrieval working (not just WorkIQ summary)

#### V3+ — Meeting Participant & Scheduled Automation

**Summary:** Exploration of real-time meeting participation (Tier 4) and scheduled automation (daily digests, sprint summaries, proactive triage suggestions).

**Customer gets:**
- Bot is "in" the meeting — can be asked questions during live discussion
- Scheduled channel posts — morning briefings, sprint status, untriaged idea reminders
- Proactive suggestions — bot notices an idea in a meeting and offers to triage it

**Problems solved:**
- Real-time meeting support (north star)
- Proactive idea capture without manual @mentions

**Success criteria:** TBD based on V1/V2 learnings and Teams platform capabilities.

---

## 7) Dependencies, Integrations, and Rollout

### Technical Dependencies

| Requirement | Source | Notes |
|-------------|--------|-------|
| Azure OpenAI endpoint | Azure subscription | GPT-4 or Claude via API |
| Azure Bot Service | Azure subscription | Bot registration + hosting |
| Azure App Service | Azure subscription | Node.js runtime for the bot |
| Teams app registration | M365 admin | Sideload for dev, org-publish for team |
| GitHub repo access | Git credentials on bot | For writing output files (ideas/, research/, specs) |
| ADO MCP server | Existing (`@azure-devops/mcp`) | Same MCP config as current CLI setup |
| WorkIQ MCP | Existing (`@microsoft/workiq`) | Need to solve full-transcript retrieval |

### Rollout

- **Dev/test:** Sideload the bot in a personal Teams context, validate multi-turn conversations
- **Team pilot:** Add to the team's main chat, test with real ideas and meetings for 2 weeks
- **Broader roll-out:** Publish as org app if pilot succeeds
- **Rollback:** Delete the Teams app; no data migration needed, all output is in the Git repo

### Ownership

| Phase | Owner | Support |
|-------|-------|---------|
| V1 build | Matthew | — |
| V1 pilot | Matthew + PM team | Team provides feedback |
| V2 (transcript) | Matthew | WorkIQ team for transcript API guidance |

---

## 8) Risks, Alternatives & Open Questions

### Key Decisions

| Decision | Options Considered | Rationale | Tension |
|----------|-------------------|-----------|---------|
| Teams SDK custom engine agent | Teams SDK vs. Copilot Studio vs. Copilot Cowork vs. Claude Cowork | Teams SDK gives full control over system prompts, MCP tools, and multi-agent routing. Other options require dumbing down the agent stack. | Requires more build effort than low-code alternatives. |
| Azure OpenAI as LLM | Azure OpenAI vs. Anthropic API vs. OpenAI direct | Azure OpenAI for enterprise compliance, existing subscription, and tool-use support. | Locks to OpenAI models; Claude may be better for some agent behaviors. |
| Git repo for output | Git repo vs. SharePoint vs. Teams channel files | Repo is the existing artifact store; keeps consistency with CLI workflow. | Team members who don't use Git won't see output files unless linked in chat. |

### Top Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| WorkIQ returns summary instead of full transcript | High | Medium | Investigate WorkIQ prompt engineering to force full transcript; fallback to Graph API for transcript access |
| Multi-turn conversation state lost between thread replies | Medium | High | Implement conversation state store (Azure Table Storage or in-memory with TTL) |
| Token limits hit for long conversations with full system prompts + skills loaded | Medium | Medium | Progressive skill loading — load PM Lead first, load target agent only after classification |
| Team doesn't adopt because they forget to @mention | Low | Medium | Scheduled digest bot posts as a reminder; pin bot in team chats |

### Open Questions

- **Q1:** How to force WorkIQ to return the full meeting transcript instead of a summary? Need to test prompt engineering approaches or determine if there's an API parameter.
- **Q2:** Should the bot maintain persistent conversation state across sessions, or is per-thread sufficient? Per-thread is simpler but means the bot can't reference a triage from a previous chat.
- **Q3:** What's the token budget for a full agent load (PM Lead prompt + target agent prompt + skills + team knowledge + conversation history)? Need to profile and determine if context window limits force tradeoffs.
- **Q4:** Should the bot post a summary to a designated channel when it completes a triage or spec, so the team has visibility without being in the original thread?

---

## Appendix

### Definitions

| Term | Definition |
|------|-----------|
| **PM Lead** | The orchestrator agent that classifies user intent and routes to specialized agents |
| **Idea Triage** | Agent that evaluates whether a product idea is worth pursuing before spec-writing |
| **Spec Writer** | Agent that produces executive-ready specs through brainstorm or batch mode |
| **MCP** | Model Context Protocol — standardized protocol for connecting LLM agents to external tools |
| **Custom Engine Agent** | A Teams bot built with the Teams SDK that uses your own LLM and orchestration logic |
| **WorkIQ** | Microsoft's MCP server for M365 data — email, meetings, files, calendar |
| **Tier 1–4** | Scope ladder for bot capabilities (chat responder → task executor → meeting-aware → meeting participant) |

### Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────┐
│  Microsoft Teams                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Any chat / meeting chat / channel        │  │
│  │  User: @PMAgent triage this idea          │  │
│  └──────────────────┬────────────────────────┘  │
└─────────────────────┼───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  Azure Bot Service                               │
│  ┌───────────────────────────────────────────┐  │
│  │  Teams SDK Bot (Node.js / TypeScript)     │  │
│  │                                           │  │
│  │  1. Receive activity                      │  │
│  │  2. Load PM Lead system prompt            │  │
│  │  3. Classify intent → select agent        │  │
│  │  4. Load agent prompt + skills            │  │
│  │  5. Build tool definitions                │  │
│  │  6. Call Azure OpenAI                     │  │
│  │  7. Post response to thread               │  │
│  └──────────────┬────────────────────────────┘  │
└─────────────────┼───────────────────────────────┘
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
  ┌─────────┐ ┌────────┐ ┌────────┐
  │ Azure   │ │ ADO    │ │WorkIQ  │
  │ OpenAI  │ │ MCP    │ │ MCP    │
  │ (LLM)   │ │        │ │        │
  └─────────┘ └────────┘ └────────┘
                  │
                  ▼
            ┌──────────┐
            │ GitHub   │
            │ Repo     │
            │(output)  │
            └──────────┘
```
