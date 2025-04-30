/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/shaadcode/payload-auditor',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/changelog',
    '@semantic-release/github',

    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: '✨ Features', hidden: false },
            { type: 'fix', section: '🐛 Bug Fixes', hidden: false },
            { type: 'docs', section: '📝 Documentation', hidden: false },
            { type: 'style', section: '💄 Styles', hidden: false },
            { type: 'refactor', section: '♻️ Refactoring', hidden: false },
            { type: 'perf', section: '⚡ Performance Improvements', hidden: false },
            { type: 'test', section: '✅ Tests', hidden: false },
            { type: 'chore', section: '🔧 Chores', hidden: false },
          ],
        },
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: process.env.PUBLISH_NPM === 'true',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
}
