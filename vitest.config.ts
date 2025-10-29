import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// const dirname
//   = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      exclude: ['**/*.d.ts'],
      include: ['src/**/*'],
    },
    globals: true,
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
  },
});
