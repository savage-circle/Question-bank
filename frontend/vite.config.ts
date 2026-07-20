import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': env.VITE_BACKEND_URL ?? 'http://localhost:3000',
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: ['node_modules/', '**/*.test.{ts,tsx}', 'src/test/setup.ts'],
        thresholds: {
          lines: 70,
          functions: 70,
          branches: 60,
          statements: 70,
        },
      },
    },
  };
});
