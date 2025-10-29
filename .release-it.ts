import type { Config } from 'release-it'

export default {
  git: {
    commitMessage: 'chore: release v${version}',
    tagName: 'v${version}',
    push: true,
    pushRepo: 'origin',
    requireBranch: 'release/latest',
  },
  hooks: {
    'before:init': ['git pull'],
  },
  github: {
    release: true,
    releaseName: 'v${version}',
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
            hidden: true,
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
            hidden: true,
          },
          {
            type: 'style',
            section: '🎨 Styles',
            hidden: true,
          },
        ],
      },
    },
  },
} satisfies Config
