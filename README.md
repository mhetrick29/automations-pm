
# Brain Agents Pack (3 agents)

This pack includes **User Research**, **Spec Writer**, and **Prototyping** agents with a unified header schema.

## Install
1. Place the `agents/` and `tools/` folders at your repo root.
2. Merge `copilot.json` with your existing manifest (or use as-is if you have none).

## Use (Copilot CLI)
```bash
# Spec Writer
copilot run agents/spec-writer-agent -- "Draft an executive one-pager and full spec for <topic> using <folder>."   --files <folder>

# User Research
copilot run agents/user-research-agent -- "Create a discussion guide for <topic>" --files <folder>

# Prototyping
copilot run agents/prototyping-agent -- "Create a deployable prototype for project <folder>. Use <file name> as the spec; use other files as context. Target vercel." --files <folder>
```

## Notes
- Keep secrets out of prompts and code.
- If an agent needs clarifications, it will ask up to 3 questions, then proceed with visible assumptions.
