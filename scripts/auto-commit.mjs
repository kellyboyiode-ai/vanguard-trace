import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const args = new Set(process.argv.slice(2))
const runOnce = args.has('--once')
const intervalMs = Number.parseInt(process.env.AUTO_COMMIT_INTERVAL_MS ?? '30000', 10)
const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, '..')

if (!Number.isFinite(intervalMs) || intervalMs < 1000) {
  console.error('AUTO_COMMIT_INTERVAL_MS must be a number greater than or equal to 1000.')
  process.exit(1)
}

function runGit(commandArgs, options = {}) {
  return spawnSync('git', commandArgs, {
    cwd: repoRoot,
    encoding: 'utf8',
    ...options,
  })
}

function ensureRepo() {
  const result = runGit(['rev-parse', '--is-inside-work-tree'])
  if (result.status !== 0 || result.stdout.trim() !== 'true') {
    console.error('Auto-commit can only run inside a git repository.')
    process.exit(1)
  }
}

function getPendingChanges() {
  const result = runGit(['status', '--porcelain'])
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || 'Unable to read git status.')
  }

  return result.stdout.trim()
}

function commitChanges() {
  const addResult = runGit(['add', '-A'])
  if (addResult.status !== 0) {
    throw new Error(addResult.stderr.trim() || 'git add failed.')
  }

  const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', ' UTC')
  const commitResult = runGit(['commit', '-m', `chore: auto-commit ${timestamp}`])

  if (commitResult.status !== 0) {
    const output = `${commitResult.stdout}\n${commitResult.stderr}`.trim()
    if (output.includes('nothing to commit')) {
      return false
    }

    throw new Error(output || 'git commit failed.')
  }

  process.stdout.write(commitResult.stdout)
  return true
}

function tick() {
  try {
    const pendingChanges = getPendingChanges()
    if (!pendingChanges) {
      console.log(`[${new Date().toLocaleString()}] No changes detected.`)
      return
    }

    console.log(`[${new Date().toLocaleString()}] Changes detected. Creating commit...`)
    const committed = commitChanges()
    if (!committed) {
      console.log('Changes were already committed.')
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
  }
}

ensureRepo()
tick()

if (!runOnce) {
  console.log(`Auto-commit is running. Checking every ${intervalMs}ms. Press Ctrl+C to stop.`)
  setInterval(tick, intervalMs)
}