#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(REPO_ROOT, '.generic-check.yaml');
const SHOW_FIX_SUGGESTIONS = process.argv.includes('--fix-suggestions');

const COLORS = {
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  reset: '\u001b[0m',
};

const DEFAULT_ALLOWLIST = [
  {
    pattern: 'Brain Dump',
    reason: 'Agent name — describes the action, not a product',
  },
  {
    pattern: 'brain-dump',
    reason: 'Agent ID — kebab-case',
  },
];

const DEFAULT_PRODUCT_TERMS = [
  'Brain/AIOps',
  'Brain • AIOps',
  'AIOps',
  'Brain',
];

const ALLOWED_TEAM_KNOWLEDGE_FILES = new Set([
  'writing-style-guide.md',
  'config.yaml',
]);

function main() {
  console.log('🔍 Scanning agent and skill files for hardcoded domain references...');
  console.log('');

  const config = loadConfig(CONFIG_PATH);
  const files = getFilesToScan(REPO_ROOT, config.skip_files);
  let totalViolations = 0;
  let filesWithViolations = 0;

  for (const filePath of files) {
    const relativePath = path.relative(REPO_ROOT, filePath);
    const violations = scanFile(filePath, relativePath, config);

    if (violations.length > 0) {
      filesWithViolations += 1;
      totalViolations += violations.length;
      console.log(`${COLORS.red}❌ ${relativePath}${COLORS.reset}`);

      for (const violation of violations) {
        console.log(`   Line ${violation.lineNumber}: "${violation.matchText}" — ${violation.reason}`);
        if (SHOW_FIX_SUGGESTIONS && violation.suggestion) {
          console.log(`      Suggestion: ${violation.suggestion}`);
        }
      }

      console.log('');
      continue;
    }

    console.log(`${COLORS.green}✅ ${relativePath} — clean${COLORS.reset}`);
  }

  console.log('');
  console.log(`Summary: ${totalViolations} violations in ${filesWithViolations} files (${files.length} files scanned)`);
  process.exitCode = totalViolations > 0 ? 1 : 0;
}

function loadConfig(configPath) {
  const config = {
    allowlist: [...DEFAULT_ALLOWLIST],
    extra_patterns: [],
    skip_files: [],
  };

  if (!fs.existsSync(configPath)) {
    return config;
  }

  const parsed = parseSimpleYaml(fs.readFileSync(configPath, 'utf8'));

  if (Array.isArray(parsed.allowlist)) {
    config.allowlist = parsed.allowlist
      .map(normalizePatternEntry)
      .filter((entry) => entry && entry.pattern);
  }

  if (Array.isArray(parsed.extra_patterns)) {
    config.extra_patterns = parsed.extra_patterns
      .map(normalizePatternEntry)
      .filter((entry) => entry && entry.pattern);
  }

  if (Array.isArray(parsed.skip_files)) {
    config.skip_files = parsed.skip_files
      .map((value) => typeof value === 'string' ? normalizeSlashPath(value) : '')
      .filter(Boolean);
  }

  return config;
}

function normalizePatternEntry(entry) {
  if (typeof entry === 'string') {
    return { pattern: entry, reason: '' };
  }

  if (!entry || typeof entry !== 'object' || typeof entry.pattern !== 'string') {
    return null;
  }

  return {
    pattern: entry.pattern,
    reason: typeof entry.reason === 'string' ? entry.reason : '',
  };
}

function parseSimpleYaml(source) {
  const result = {};
  let currentSection = null;
  let currentObject = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const topLevelMatch = rawLine.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (topLevelMatch && !rawLine.startsWith(' ')) {
      currentSection = topLevelMatch[1];
      currentObject = null;
      const inlineValue = (topLevelMatch[2] || '').trim();

      if (inlineValue === '[]') {
        result[currentSection] = [];
        continue;
      }

      if (!Object.prototype.hasOwnProperty.call(result, currentSection)) {
        result[currentSection] = [];
      }
      continue;
    }

    if (!currentSection) {
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const itemValue = trimmed.slice(2).trim();

      if (currentSection === 'allowlist' || currentSection === 'extra_patterns') {
        if (itemValue.startsWith('pattern:')) {
          currentObject = { pattern: parseYamlScalar(itemValue.slice('pattern:'.length).trim()) };
          result[currentSection].push(currentObject);
        } else if (!itemValue) {
          currentObject = {};
          result[currentSection].push(currentObject);
        } else {
          currentObject = null;
          result[currentSection].push(parseYamlScalar(itemValue));
        }
      } else if (currentSection === 'skip_files') {
        result[currentSection].push(parseYamlScalar(itemValue));
        currentObject = null;
      }
      continue;
    }

    if ((currentSection === 'allowlist' || currentSection === 'extra_patterns') && currentObject) {
      const propertyMatch = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (propertyMatch) {
        currentObject[propertyMatch[1]] = parseYamlScalar(propertyMatch[2].trim());
      }
    }
  }

  return result;
}

function parseYamlScalar(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");
  }

  return value;
}

function getFilesToScan(repoRoot, skipFiles) {
  const files = [];
  const skipSet = new Set(skipFiles.map(normalizeSlashPath));
  const agentsDir = path.join(repoRoot, 'agents');
  const skillsDir = path.join(repoRoot, 'skills');

  walkDirectory(agentsDir, (entryPath, entryName) => {
    if (entryName.endsWith('-agent.system.md') || entryName.endsWith('-agent.md')) {
      files.push(entryPath);
    }
  });

  if (fs.existsSync(skillsDir)) {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.skill.md')) {
        files.push(path.join(skillsDir, entry.name));
      }
    }
  }

  return files
    .filter((filePath) => {
      const relativePath = normalizeSlashPath(path.relative(repoRoot, filePath));
      return !skipSet.has(relativePath) && !skipSet.has(path.basename(filePath));
    })
    .sort((left, right) => left.localeCompare(right));
}

function walkDirectory(directoryPath, onFile) {
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(entryPath, onFile);
      continue;
    }

    if (entry.isFile()) {
      onFile(entryPath, entry.name);
    }
  }
}

function scanFile(filePath, relativePath, config) {
  const contents = fs.readFileSync(filePath, 'utf8');
  const lines = contents.split(/\r?\n/);
  const violations = [];
  const seen = new Set();
  const compiledExtraPatterns = config.extra_patterns.map((entry) => compileExtraPattern(entry));

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    for (const violation of detectTeamKnowledgeFileRefs(line, lineNumber)) {
      pushViolation(violations, seen, relativePath, line, violation, config.allowlist);
    }

    for (const violation of detectProductTerms(line, lineNumber)) {
      pushViolation(violations, seen, relativePath, line, violation, config.allowlist);
    }

    for (const violation of detectPersonalStyleRefs(line, lineNumber)) {
      pushViolation(violations, seen, relativePath, line, violation, config.allowlist);
    }

    for (const compiledPattern of compiledExtraPatterns) {
      if (!compiledPattern) {
        continue;
      }

      const matches = line.matchAll(compiledPattern.regex);
      for (const match of matches) {
        const matchText = match[0];
        pushViolation(violations, seen, relativePath, line, {
          lineNumber,
          matchText,
          reason: compiledPattern.reason || 'blocked by .generic-check.yaml',
          suggestion: 'Replace this hardcoded reference with a generic term or add a narrowly scoped allowlist entry if it is intentionally structural.',
        }, config.allowlist);
      }
    }
  });

  return violations;
}

function pushViolation(violations, seen, relativePath, line, violation, allowlist) {
  if (!violation || !violation.matchText) {
    return;
  }

  if (isAllowlisted(line, violation.matchText, allowlist)) {
    return;
  }

  const key = `${relativePath}:${violation.lineNumber}:${violation.matchText}:${violation.reason}`;
  if (seen.has(key)) {
    return;
  }

  seen.add(key);
  violations.push(violation);
}

function isAllowlisted(line, matchText, allowlist) {
  const trimmedLine = line.trim();
  return allowlist.some((entry) => entry.pattern === matchText || entry.pattern === trimmedLine);
}

function detectTeamKnowledgeFileRefs(line, lineNumber) {
  const violations = [];
  const regex = /(^|[^*])team-knowledge\/([a-zA-Z0-9_-]+\.md)\b/g;

  for (const match of line.matchAll(regex)) {
    const fileName = match[2];
    if (ALLOWED_TEAM_KNOWLEDGE_FILES.has(fileName)) {
      continue;
    }

    violations.push({
      lineNumber,
      matchText: fileName,
      reason: 'hardcoded team-knowledge filename',
      suggestion: 'Reference a directory such as team-knowledge/product-context/ or use a glob such as team-knowledge/*.md instead of naming a single instance-specific file.',
    });
  }

  return violations;
}

function detectProductTerms(line, lineNumber) {
  if (/^\s*-\s*v[01]\./.test(line)) {
    return [];
  }

  const violations = [];
  const occupiedRanges = [];

  for (const term of DEFAULT_PRODUCT_TERMS) {
    const regex = new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(term)}(?![A-Za-z0-9_])`, 'g');

    for (const match of line.matchAll(regex)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;

      if (rangesOverlap(start, end, occupiedRanges)) {
        continue;
      }

      if (term === 'Brain' && line.slice(start, start + 'Brain Dump'.length) === 'Brain Dump') {
        continue;
      }

      occupiedRanges.push([start, end]);
      violations.push({
        lineNumber,
        matchText: match[0],
        reason: 'hardcoded product name',
        suggestion: 'Replace this with generic product, team, or domain wording so the prompt stays portable.',
      });
    }
  }

  return violations;
}

function detectPersonalStyleRefs(line, lineNumber) {
  const violations = [];
  const styleFileRegex = /\b([a-z]+-style\.md)\b/g;
  const personalRefRegex = /\b([A-Z][a-z]+'s personal)\b/g;

  for (const match of line.matchAll(styleFileRegex)) {
    violations.push({
      lineNumber,
      matchText: match[1],
      reason: 'named personal style reference',
      suggestion: 'Reference team-knowledge/writing-styles/ or a generic style guide instead of a named person-specific style file.',
    });
  }

  for (const match of line.matchAll(personalRefRegex)) {
    violations.push({
      lineNumber,
      matchText: match[1],
      reason: 'person-specific writing style reference',
      suggestion: 'Describe the style requirement generically or point to a shared style directory instead of a person-specific reference.',
    });
  }

  return violations;
}

function compileExtraPattern(entry) {
  if (!entry?.pattern) {
    return null;
  }

  const regexLiteral = entry.pattern.match(/^\/(.*)\/([dgimsuvy]*)$/);
  if (regexLiteral) {
    const [, source, flags] = regexLiteral;
    const normalizedFlags = flags.includes('g') ? flags : `${flags}g`;
    return {
      regex: new RegExp(source, normalizedFlags),
      reason: entry.reason,
    };
  }

  return {
    regex: new RegExp(escapeRegExp(entry.pattern), 'g'),
    reason: entry.reason,
  };
}

function normalizeSlashPath(value) {
  return value.replace(/\\/g, '/');
}

function rangesOverlap(start, end, ranges) {
  return ranges.some(([existingStart, existingEnd]) => start < existingEnd && end > existingStart);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
