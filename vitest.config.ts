import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    coverage: {
      exclude: ['**/*.d.ts'],
      include: ['src/**/*'],
    },
    globals: true,
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
  },
});
