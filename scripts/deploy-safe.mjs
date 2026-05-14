import { spawnSync } from 'node:child_process';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    ...options,
  });

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
}

function read(command, args) {
  const result = spawnSync(command, args, {
    stdio: ['ignore', 'pipe', 'ignore'],
    shell: process.platform === 'win32',
    encoding: 'utf8',
  });

  if (result.error || result.status !== 0) {
    return '';
  }

  return (result.stdout || '').trim();
}

const flags = new Set(process.argv.slice(2));
const isPreview = flags.has('--preview');
const allowDirty = flags.has('--allow-dirty');

const status = read('git', ['status', '--porcelain']);
if (status && !allowDirty) {
  console.error(
    'Deploy blocked: working tree has uncommitted changes. Commit/stash first, or rerun with --allow-dirty.',
  );
  process.exit(1);
}

const projectName = 'vanguardtrace';
const deployArgs = ['pages', 'deploy', 'dist', '--project-name', projectName];

if (isPreview) {
  deployArgs.push('--branch', 'preview');
}

console.log(
  `Starting ${isPreview ? 'preview' : 'production'} deploy for ${projectName}...`,
);

run('npm', ['run', 'build']);
run('wrangler', deployArgs);
