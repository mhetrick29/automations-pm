import * as fs from "fs";
import * as path from "path";

export interface LoadedPrompt {
  systemPrompt: string;
  agentName: string;
  skills: string[];
}

/**
 * Reads a .system.md or .skill.md file, stripping YAML frontmatter
 * and returning the markdown body.
 */
function readPromptFile(filePath: string): string {
  const content = fs.readFileSync(filePath, "utf-8");
  // Strip YAML frontmatter (between --- delimiters)
  const frontmatterMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  if (frontmatterMatch) {
    return content.slice(frontmatterMatch[0].length).trim();
  }
  return content.trim();
}

/**
 * Extracts skill file references from a system prompt.
 * Looks for patterns like `skills/some-skill.skill.md` or
 * backtick-quoted skill paths.
 */
function extractSkillRefs(promptContent: string): string[] {
  const refs: string[] = [];
  const pattern = /skills\/[\w-]+\.skill\.md/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(promptContent)) !== null) {
    if (!refs.includes(match[0])) {
      refs.push(match[0]);
    }
  }
  return refs;
}

/**
 * Loads an agent's system prompt and all referenced skills,
 * assembling them into a single system prompt string.
 */
export function loadAgent(
  agentId: string,
  agentsRoot: string,
  skillsRoot: string,
  knowledgeRoot?: string
): LoadedPrompt {
  // Find the agent's system prompt file
  const agentDir = path.join(agentsRoot, agentId);
  const files = fs.readdirSync(agentDir);
  const systemFile = files.find((f) => f.endsWith(".system.md"));
  if (!systemFile) {
    throw new Error(`No .system.md file found in ${agentDir}`);
  }

  const systemPromptPath = path.join(agentDir, systemFile);
  const systemPrompt = readPromptFile(systemPromptPath);

  // Extract and load referenced skills
  const skillRefs = extractSkillRefs(systemPrompt);
  const loadedSkills: string[] = [];
  const skillContents: string[] = [];

  for (const ref of skillRefs) {
    const skillPath = path.join(
      skillsRoot,
      path.basename(ref)
    );
    if (fs.existsSync(skillPath)) {
      skillContents.push(
        `\n\n--- SKILL: ${path.basename(ref)} ---\n\n${readPromptFile(skillPath)}`
      );
      loadedSkills.push(ref);
    }
  }

  // Optionally load team knowledge context (lightweight summary)
  let knowledgeContext = "";
  if (knowledgeRoot && fs.existsSync(knowledgeRoot)) {
    const productContextDir = path.join(knowledgeRoot, "product-context");
    if (fs.existsSync(productContextDir)) {
      const contextFiles = fs
        .readdirSync(productContextDir)
        .filter((f) => f.endsWith(".md"));
      for (const cf of contextFiles) {
        const content = fs.readFileSync(
          path.join(productContextDir, cf),
          "utf-8"
        );
        knowledgeContext += `\n\n--- KNOWLEDGE: ${cf} ---\n\n${content}`;
      }
    }
  }

  const fullPrompt = [systemPrompt, ...skillContents, knowledgeContext]
    .filter(Boolean)
    .join("\n");

  return {
    systemPrompt: fullPrompt,
    agentName: agentId,
    skills: loadedSkills,
  };
}

/**
 * Lists all available agent IDs by scanning the agents directory.
 */
export function listAgents(agentsRoot: string): string[] {
  return fs
    .readdirSync(agentsRoot)
    .filter((entry) => {
      const entryPath = path.join(agentsRoot, entry);
      return (
        fs.statSync(entryPath).isDirectory() &&
        fs
          .readdirSync(entryPath)
          .some((f) => f.endsWith(".system.md"))
      );
    });
}
