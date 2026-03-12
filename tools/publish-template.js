#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';

const scriptPath = path.resolve(process.argv[1]);
const repoRoot = path.resolve(path.dirname(scriptPath), '..');
const tempBranch = '_publish-temp';
const publishStatePath = path.join(repoRoot, '.publish-state.json');
const publishRemotes = ['general-ms', 'personal'];
const rootDocExtensions = new Set(['.doc', '.docx', '.ppt', '.pptx', '.pptm', '.xls', '.xlsx']);

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

function colorize(color, text) {
  return `${colors[color]}${text}${colors.reset}`;
}

function logInfo(message) {
  console.log(message);
}

function logSuccess(message) {
  console.log(colorize('green', message));
}

function logWarning(message) {
  console.log(colorize('yellow', message));
}

function logError(message) {
  console.error(colorize('red', message));
}

function shellQuote(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function runCommand(command, options = {}) {
  return execSync(command, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
  });
}

function runGit(args, options = {}) {
  return runCommand(`git ${args}`, options);
}

function getCommandErrorOutput(error) {
  const stdout = error?.stdout ? String(error.stdout) : '';
  const stderr = error?.stderr ? String(error.stderr) : '';
  return [stdout.trim(), stderr.trim()].filter(Boolean).join('\n');
}

function pathExists(targetPath) {
  return fs.existsSync(targetPath);
}

function isDirectory(targetPath) {
  return pathExists(targetPath) && fs.statSync(targetPath).isDirectory();
}

function listDirectEntries(directoryPath) {
  if (!isDirectory(directoryPath)) {
    return [];
  }

  return fs.readdirSync(directoryPath, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    path: path.join(directoryPath, entry.name),
    isFile: entry.isFile(),
    isDirectory: entry.isDirectory(),
  }));
}

function toRelative(targetPath) {
  return path.relative(repoRoot, targetPath).replace(/\\/g, '/');
}

function uniqueSortedPaths(paths) {
  return Array.from(new Set(paths.filter(Boolean))).sort((left, right) => left.localeCompare(right));
}

function getCurrentBranchName() {
  return runGit('rev-parse --abbrev-ref HEAD').trim();
}

function getCurrentHead() {
  return runGit('rev-parse HEAD').trim();
}

function getShortHash(hash) {
  return hash.slice(0, 7);
}

function ensureCleanWorkingTree() {
  const status = runGit('status --porcelain').trim();
  if (status) {
    throw new Error('Working tree has uncommitted changes. Commit, stash, or discard them before publishing.');
  }
}

function branchExists(branchName) {
  return runGit(`branch --list ${shellQuote(branchName)}`).trim().length > 0;
}

function deleteTempBranchIfNeeded(currentBranch) {
  if (!branchExists(tempBranch)) {
    return;
  }

  if (currentBranch === tempBranch) {
    throw new Error(`Temporary branch ${tempBranch} is currently checked out. Switch branches before running publish.`);
  }

  logWarning(`Deleting existing ${tempBranch} branch before publishing.`);
  runGit(`branch -D ${shellQuote(tempBranch)}`);
}

function removePath(targetPath) {
  if (!pathExists(targetPath)) {
    return false;
  }

  fs.rmSync(targetPath, { recursive: true, force: true });
  return true;
}

function ensureFile(targetPath, content) {
  const parent = path.dirname(targetPath);
  fs.mkdirSync(parent, { recursive: true });
  fs.writeFileSync(targetPath, content, 'utf8');
}

function gatherPublishRemovalCandidates() {
  const candidates = [];

  const productContextDir = path.join(repoRoot, 'team-knowledge', 'product-context');
  for (const entry of listDirectEntries(productContextDir)) {
    if (entry.isFile && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      candidates.push(entry.path);
    }
  }

  const teamKnowledgeDir = path.join(repoRoot, 'team-knowledge');
  for (const entry of listDirectEntries(teamKnowledgeDir)) {
    if (entry.isFile && entry.name.endsWith('.md') && entry.name !== 'writing-style-guide.md') {
      candidates.push(entry.path);
    }
  }

  const writingStylesDir = path.join(repoRoot, 'team-knowledge', 'writing-styles');
  for (const entry of listDirectEntries(writingStylesDir)) {
    if (entry.isFile && entry.name.endsWith('-style.md')) {
      candidates.push(entry.path);
    }
  }

  candidates.push(
    path.join(repoRoot, 'team-knowledge', '.sync-state.json'),
    path.join(repoRoot, '.claude'),
    path.join(repoRoot, '.vscode', 'mcp.json'),
    path.join(repoRoot, 'mcp.json'),
    path.join(repoRoot, 'setup.yaml'),
    path.join(repoRoot, 'Docs'),
    path.join(repoRoot, 'draft-pm-skill.md'),
    path.join(repoRoot, 'daily-summaries')
  );

  const prototypesDir = path.join(repoRoot, 'prototypes');
  for (const entry of listDirectEntries(prototypesDir)) {
    if (entry.name !== '.gitkeep') {
      candidates.push(entry.path);
    }
  }

  for (const entry of listDirectEntries(repoRoot)) {
    if (!entry.isFile) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (ext === '.png' || rootDocExtensions.has(ext)) {
      candidates.push(entry.path);
    }
  }

  return uniqueSortedPaths(candidates);
}

function applyPublishRemovals() {
  const candidates = gatherPublishRemovalCandidates();
  const removed = [];

  for (const candidate of candidates) {
    if (removePath(candidate)) {
      removed.push(candidate);
    }
  }

  const created = [];
  const prototypesDir = path.join(repoRoot, 'prototypes');
  if (isDirectory(prototypesDir)) {
    const remainingEntries = fs.readdirSync(prototypesDir).filter((entry) => entry !== '.DS_Store' && entry !== 'Thumbs.db');
    if (remainingEntries.length === 0) {
      const gitkeepPath = path.join(prototypesDir, '.gitkeep');
      if (!pathExists(gitkeepPath)) {
        ensureFile(gitkeepPath, '');
        created.push(gitkeepPath);
      }
    }
  }

  runGit('add -A');

  const stagedDeletedPaths = uniqueSortedPaths(
    runGit('diff --cached --name-only --diff-filter=D')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  );

  const stagedAddedPaths = uniqueSortedPaths(
    runGit('diff --cached --name-only --diff-filter=A')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  );

  return {
    candidates: candidates.map(toRelative),
    removed: removed.map(toRelative),
    created: created.map(toRelative),
    stagedDeletedPaths,
    stagedAddedPaths,
  };
}

function writePublishState(lastPublishCommit, remotes) {
  const payload = {
    lastPublishCommit,
    lastPublishDate: new Date().toISOString(),
    remotes,
  };

  fs.writeFileSync(publishStatePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function printRemovalPreview(removalInfo, dryRun) {
  const heading = dryRun ? 'Dry run: files that would be removed:' : 'Files removed from publish branch:';
  logInfo(heading);

  if (removalInfo.stagedDeletedPaths.length === 0) {
    logInfo('  (none)');
  } else {
    for (const filePath of removalInfo.stagedDeletedPaths) {
      logInfo(`  - ${filePath}`);
    }
  }

  const placeholderPaths = removalInfo.stagedAddedPaths.filter((filePath) => filePath === 'prototypes/.gitkeep');
  if (placeholderPaths.length > 0) {
    logInfo('Created placeholders:');
    for (const filePath of placeholderPaths) {
      logInfo(`  + ${filePath}`);
    }
  }
}

function cleanupTempBranch(originalRef) {
  const cleanupErrors = [];

  try {
    runGit(`checkout ${shellQuote(originalRef)}`);
  } catch (error) {
    cleanupErrors.push(`Failed to restore ${originalRef}: ${getCommandErrorOutput(error) || error.message}`);
  }

  try {
    if (branchExists(tempBranch)) {
      runGit(`branch -D ${shellQuote(tempBranch)}`);
    }
  } catch (error) {
    cleanupErrors.push(`Failed to delete ${tempBranch}: ${getCommandErrorOutput(error) || error.message}`);
  }

  if (cleanupErrors.length > 0) {
    throw new Error(cleanupErrors.join('\n'));
  }
}

async function prompt(questionText) {
  if (!process.stdin.isTTY) {
    logWarning('No interactive terminal detected. Defaulting to all commits.');
    return 'all';
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(questionText, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function parseSelection(input, commits) {
  const trimmed = input.trim().toLowerCase();
  if (trimmed === '' || trimmed === 'a' || trimmed === 'all' || trimmed === 'y' || trimmed === 'yes') {
    return commits;
  }

  if (trimmed === 'n' || trimmed === 'no' || trimmed === 'q' || trimmed === 'quit') {
    return [];
  }

  const selectedIndexes = new Set();
  const tokens = input.split(',').map((token) => token.trim()).filter(Boolean);
  for (const token of tokens) {
    const rangeMatch = token.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > commits.length) {
        throw new Error(`Invalid selection range: ${token}`);
      }
      for (let index = start; index <= end; index += 1) {
        selectedIndexes.add(index - 1);
      }
      continue;
    }

    const value = Number(token);
    if (!Number.isInteger(value) || value < 1 || value > commits.length) {
      throw new Error(`Invalid selection: ${token}`);
    }
    selectedIndexes.add(value - 1);
  }

  return Array.from(selectedIndexes)
    .sort((left, right) => left - right)
    .map((index) => commits[index]);
}

function readPublishState() {
  if (!pathExists(publishStatePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(publishStatePath, 'utf8'));
}

function getRemoteCommits(remoteName, publishState) {
  if (publishState?.lastPublishCommit) {
    try {
      const output = runGit(`log --reverse --format=%H%x09%h %s ${shellQuote(`${publishState.lastPublishCommit}..${remoteName}/main`)}`);
      const commits = output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [hash, summary] = line.split('\t');
          return { hash, summary };
        });
      return {
        commits,
        usedPublishState: true,
      };
    } catch (error) {
      logWarning(`Unable to compare against last publish commit ${publishState.lastPublishCommit}. Showing the last 10 remote commits instead.`);
    }
  }

  const output = runGit(`log --reverse -n 10 --format=%H%x09%h %s ${shellQuote(`${remoteName}/main`)}`);
  const commits = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [hash, summary] = line.split('\t');
      return { hash, summary };
    });

  return {
    commits,
    usedPublishState: false,
  };
}

function showImportCommits(remoteName, commits, usedPublishState) {
  if (commits.length === 0) {
    logInfo(`No new commits found on ${remoteName}/main.`);
    return;
  }

  if (usedPublishState) {
    logInfo(`Commits on ${remoteName}/main since the last publish:`);
  } else {
    logInfo(`Last ${Math.min(commits.length, 10)} commits on ${remoteName}/main:`);
  }

  commits.forEach((commit, index) => {
    logInfo(`  ${index + 1}. ${commit.summary}`);
  });
}

async function importFromRemote(remoteName) {
  logInfo(`Fetching ${remoteName}...`);
  runGit(`fetch ${shellQuote(remoteName)}`);

  const publishState = readPublishState();
  const { commits, usedPublishState } = getRemoteCommits(remoteName, publishState);
  showImportCommits(remoteName, commits, usedPublishState);

  if (commits.length === 0) {
    return;
  }

  const answer = await prompt('Cherry-pick commits? Press Enter for all, type numbers like 1,3 or 2-4, or n to cancel: ');
  const selectedCommits = parseSelection(answer, commits);
  if (selectedCommits.length === 0) {
    logWarning('No commits selected. Nothing was cherry-picked.');
    return;
  }

  const applied = [];
  for (const commit of selectedCommits) {
    try {
      logInfo(`Cherry-picking ${commit.summary}...`);
      runGit(`cherry-pick ${shellQuote(commit.hash)}`);
      applied.push(commit.summary);
    } catch (error) {
      try {
        runGit('cherry-pick --abort');
      } catch {
        // Ignore abort failures.
      }

      const output = getCommandErrorOutput(error);
      const details = output ? `\n${output}` : '';
      throw new Error(`Cherry-pick failed for ${commit.summary}.${details}\nResolve the issue manually, then retry with the remaining commits.`);
    }
  }

  logSuccess(`Cherry-picked ${applied.length} commit(s) from ${remoteName}.`);
}

function forwardPublish(dryRun) {
  const originalBranch = getCurrentBranchName();
  if (originalBranch === tempBranch) {
    throw new Error(`Currently on ${tempBranch}. Switch to your source branch before publishing.`);
  }

  deleteTempBranchIfNeeded(originalBranch);
  ensureCleanWorkingTree();

  const originalHead = getCurrentHead();
  const originalRef = originalBranch === 'HEAD' ? originalHead : originalBranch;
  let cleanupError = null;
  let operationError = null;
  let removalInfo = null;
  let publishCommit = null;
  const pushedRemotes = [];
  const failedRemotes = [];
  let wrotePublishState = false;

  try {
    logInfo(`Creating ${tempBranch} from ${getShortHash(originalHead)}...`);
    runGit(`checkout -b ${shellQuote(tempBranch)} ${shellQuote(originalHead)}`);

    removalInfo = applyPublishRemovals();
    printRemovalPreview(removalInfo, dryRun);

    if (!dryRun) {
      const message = `chore: publish template from ${getShortHash(originalHead)}`;
      runGit(`commit -m ${shellQuote(message)}`);
      publishCommit = getCurrentHead();
      logSuccess(`Created publish commit ${publishCommit}.`);

      for (const remoteName of publishRemotes) {
        try {
          logInfo(`Force-pushing to ${remoteName}/main...`);
          runGit(`push --force ${shellQuote(remoteName)} HEAD:main`, { stdio: 'pipe' });
          pushedRemotes.push(remoteName);
          logSuccess(`Pushed to ${remoteName}/main.`);
        } catch (error) {
          failedRemotes.push({ remote: remoteName, error: getCommandErrorOutput(error) || error.message });
          logError(`Force-push failed for ${remoteName}.`);
          if (failedRemotes[failedRemotes.length - 1].error) {
            logError(failedRemotes[failedRemotes.length - 1].error);
          }
        }
      }

      writePublishState(originalHead, pushedRemotes);
      wrotePublishState = true;
    }
  } catch (error) {
    operationError = error;
  } finally {
    try {
      cleanupTempBranch(originalRef);
    } catch (error) {
      cleanupError = error;
    }
  }

  if (operationError && cleanupError) {
    throw new Error(`${operationError.message}\n${cleanupError.message}`);
  }

  if (operationError) {
    throw operationError;
  }

  if (cleanupError) {
    throw cleanupError;
  }

  if (dryRun) {
    logSuccess(`Dry run complete. ${removalInfo.stagedDeletedPaths.length} tracked file(s) would be removed.`);
    return;
  }

  const pushedLabel = pushedRemotes.length > 0 ? pushedRemotes.join(', ') : '(none)';
  logInfo(`Summary: removed ${removalInfo.stagedDeletedPaths.length} file(s), commit ${publishCommit}, pushed to ${pushedLabel}.`);

  if (wrotePublishState) {
    logSuccess(`Saved publish state to ${toRelative(publishStatePath)}.`);
  }

  if (failedRemotes.length > 0) {
    throw new Error(`Publish finished with push failures: ${failedRemotes.map((entry) => entry.remote).join(', ')}`);
  }
}

function parseArgs(argv) {
  let dryRun = false;
  let importRemote = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg === '--import') {
      const remoteName = argv[index + 1];
      if (!remoteName) {
        throw new Error('Missing remote name after --import.');
      }
      importRemote = remoteName;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (dryRun && importRemote) {
    throw new Error('--dry-run cannot be combined with --import.');
  }

  return { dryRun, importRemote };
}

async function main() {
  const { dryRun, importRemote } = parseArgs(process.argv.slice(2));

  if (importRemote) {
    await importFromRemote(importRemote);
    return;
  }

  forwardPublish(dryRun);
}

main().catch((error) => {
  logError(error.message || String(error));
  process.exitCode = 1;
});
