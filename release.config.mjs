/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/shaadcode/payload-auditor',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/github',
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
