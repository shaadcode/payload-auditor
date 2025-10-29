import type { Config } from 'release-it'

export default {
  git: {
    commitMessage: 'chore: release v${version}',
    tagName: 'v${version}',
    push: true,
  },
  github: {
    releaseName: 'v${version}',
    release: true,
    preRelease: true,
  },
  npm: {
    publish: true,
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      header: '# Changelog',
      preset: {
        name: 'conventionalcommits',
        types: [
          {
            type: 'feat',
            section: '🚀 Features',
            hidden: false,
          },
          {
            type: 'fix',
            section: '🐞 Bug Fixes',
            hidden: false,
          },
          {
            type: 'chore',
            section: '🧹 Chores',
            hidden: false,
          },
          {
            type: 'docs',
            section: '📚 Documentation',
            hidden: false,
          },
          {
            type: 'refactor',
            section: '🔧 Refactoring',
            hidden: false,
          },
          {
            type: 'perf',
            section: '⚡ Performance',
            hidden: false,
          },
          {
            type: 'test',
            section: '✅ Tests',
            hidden: false,
          },
          {
            type: 'style',
            section: '🎨 Styles',
            hidden: false,
          },
        ],
      },
    },
  },
} satisfies Config
