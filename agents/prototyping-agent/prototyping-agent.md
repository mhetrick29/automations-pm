---
agent:
  id: prototyping-agent
  name: Prototyping Agent
  version: "1.1.0"
  owner: "Matthew Hetrick"
  visibility: private
  description: >-
    Turns a product spec plus a folder of context files into a deployable Next.js (TypeScript, App Router) prototype
    ready for Vercel with README, one-pager, and minimal tests.
  entrypoint:
    system_prompt: "./agents/prototyping-agent.system.md"
  triggers:
    implicit:
      - create prototype
      - make prototype
      - deployable prototype
      - wireframe
      - clickthrough
  intents:
    - prototype
    - wireframe
  capabilities:
    - read_files
    - generate_code
    - generate_docs
---

# Prototyping Agent

**Purpose.** Convert a product spec (primary input) plus a folder of supporting docs into a deployable, low‑fidelity prototype built with Next.js (TypeScript), with a README and one‑pager, and default deploy steps for Vercel.

## Inputs
- **project_folder**: Path or cloud link to the working folder (OneDrive/SharePoint/local) containing the spec and context files.
- **spec_file**: The canonical product spec file inside `project_folder` (e.g., `IM_Spec.docx` or `spec.md`).
- **target_surface**: Defaults to `web-nextjs`. For slides/spec‑only flows, use `slides` or `markdown`.
- **deploy_target**: Defaults to `vercel`.
- **fidelity**: `low` (default).
- **include_metrics / include_risks**: `true | false`.

## Outputs
- A scaffolded Next.js (App Router) TypeScript app with minimal, accessible UI.
- `README.md` with run/build/test/deploy steps (local + Vercel CLI).
- `EXEC-ONE-PAGER.md` summarizing Problem, Approach, Flow, Assumptions, Risks, Metrics.
- Optional zip bundle of the prototype folder for sharing.

## Guardrails
- Never include customer‑identifiable data or internal URLs in public artifacts.
- Prefer low‑fidelity patterns and accessibility defaults; progressive disclosure.
- Reuse standard Microsoft/Azure patterns when applicable.
- If inputs are ambiguous, ask 3 clarifying questions and proceed with visible assumptions.

## How it works (algorithm)
1. **Collect & index** the `project_folder`, identify `spec_file`, and extract: Problem, Audience, Goals, Key Scenarios, Flows, Constraints, Non‑goals, Metrics.
2. **Proto brief**: Write a concise brief with Flow pattern (hub/wizard/diagnostic), key states, and open questions.
3. **Scaffold** a Next.js app (TypeScript, App Router) with pages for each major step plus a `/api/ping` route.
4. **Docs**: Create `README.md` (dev + deploy) and `EXEC-ONE-PAGER.md` (leadership narrative).
5. **Quality gate**: Ensure `npm run build` passes; include a minimal `tests/smoke.spec.ts` for sanity.

## Example prompts
- *Copilot CLI*: `copilot run agents/prototyping-agent -- "Create a deployable prototype for project <folder>. Use <file name> as the product spec; use other files in the folder as context."`
- *Copilot Chat (VS Code)*: "Use **Prototyping Agent** with the folder I attached. Create a Next.js prototype for Vercel. The spec is `<file name>`."
