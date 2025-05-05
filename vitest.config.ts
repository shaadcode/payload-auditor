import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/*.d.ts'],
      include: ['src/**/*'],
    },
    globals: true,
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
  },
})
