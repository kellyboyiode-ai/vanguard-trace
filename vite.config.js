import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'node:child_process';

function safeGit(command, fallback = 'unknown') {
  try {
    return execSync(command, {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
  } catch {
    return fallback;
  }
}

function getBuildMeta() {
  const status = safeGit('git status --porcelain', '');

  return {
    timestamp: new Date().toISOString(),
    commit: safeGit('git rev-parse --short HEAD', 'unknown'),
    branch: safeGit('git rev-parse --abbrev-ref HEAD', 'unknown'),
    dirty: status.length > 0,
  };
}

// https://vite.dev/config/
const buildMeta = getBuildMeta();

export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    'import.meta.env.VITE_BUILD_TIMESTAMP': JSON.stringify(buildMeta.timestamp),
    'import.meta.env.VITE_BUILD_COMMIT': JSON.stringify(buildMeta.commit),
    'import.meta.env.VITE_BUILD_BRANCH': JSON.stringify(buildMeta.branch),
    'import.meta.env.VITE_BUILD_DIRTY': JSON.stringify(
      buildMeta.dirty ? 'true' : 'false',
    ),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('recharts') || id.includes('d3-')) {
            return 'vendor-charts';
          }

          if (id.includes('@supabase/supabase-js')) {
            return 'vendor-supabase';
          }

          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }

          if (id.includes('three/src/')) {
            if (id.includes('/renderers/')) {
              return 'vendor-three-render';
            }

            if (id.includes('/math/') || id.includes('/core/')) {
              return 'vendor-three-core';
            }

            return 'vendor-three-scene';
          }

          if (
            id.includes('react-router') ||
            id.includes('react-dom') ||
            id.includes('react')
          ) {
            return 'vendor-react';
          }

          return undefined;
        },
      },
    },
  },
});
