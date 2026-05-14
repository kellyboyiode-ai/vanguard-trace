import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

function run(command, options = {}) {
  return execSync(command, {
    stdio: options.stdio || 'pipe',
    encoding: 'utf8',
  });
}

function parseEnvOutput(raw) {
  const env = {};

  raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const eqIndex = line.indexOf('=');
      if (eqIndex <= 0) {
        return;
      }

      const key = line.slice(0, eqIndex).trim();
      const value = line.slice(eqIndex + 1).trim();
      env[key] = value;
    });

  return env;
}

function main() {
  try {
    console.log('Starting local Supabase services...');
    run('npx supabase start', { stdio: 'inherit' });

    console.log('Applying local database schema...');
    run('npx supabase db reset --local --yes', { stdio: 'inherit' });

    console.log('Reading local Supabase connection values...');
    const envRaw = run('npx supabase status -o env');
    const env = parseEnvOutput(envRaw);

    const supabaseUrl = env.API_URL || '';
    const supabaseAnonKey = env.ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Unable to determine API_URL/ANON_KEY from `supabase status -o env`.',
      );
    }

    const envLocalContent = [
      'VITE_ENABLE_SUPABASE=true',
      `VITE_SUPABASE_URL=${supabaseUrl}`,
      `VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}`,
      'VITE_SUPABASE_STORAGE_BUCKET=documents',
      'VITE_RECAPTCHA_SITE_KEY=',
      'VITE_GTM_ID=',
      'VITE_PROMO_IFRAME_URL=',
      'VITE_PORTAL_BASE_URL=https://portal.your-provider.example',
      'VITE_MARKETING_BASE_URL=https://www.your-company.example',
      'VITE_AVANTI_BASE_URL=https://rates.your-company.example',
      'VITE_SHIPRITE_LTL_URL=https://ltl.your-company.example',
      'VITE_CARGO_INSURANCE_URL=https://insurance.your-company.example',
      'VITE_SAILINGS_API_BASE=https://api.your-company.example',
      '',
    ].join('\n');

    const envLocalPath = path.resolve('.env.local');
    writeFileSync(envLocalPath, envLocalContent, 'utf8');

    console.log('Created .env.local with local Supabase values.');
    console.log('Local full-stack is ready. Run: npm run dev:4173');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Local backend setup failed:', message);
    process.exit(1);
  }
}

main();
