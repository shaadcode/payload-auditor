import { execSync } from 'child_process';
import type { Config } from 'release-it';

function getCommitAuthor(commitHash: string): string {
  try {
    const author = execSync(
      `git show -s --format="%an" ${commitHash}`,
      { encoding: 'utf-8' }
    ).trim();
    return author || 'unknown';
  } catch {
    return 'unknown';
  }
}
export default {
  git: {
    requireBranch: "main"
  },
  hooks: {
    "before:init": ["git pull"],
  },
  github: {
    "release": true,
  },
  "npm": {
    "publish": true,
    skipChecks: true,
    publishArgs: ["--registry", "https://registry.npmjs.org/"],

  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "infile": "CHANGELOG.md",
      "header": "# Changelog",
      strictSemVer: true,
      writerOpts: {
        commitPartial: (ctx: any, commit: any) => {
          const scope = ctx.scope
          const subject = ctx.subject
          const shortHash = ctx.raw.hash
          const hash = ctx.hash
          const owner = getCommitAuthor(hash)
          const type = ctx.raw.type
          return `- ${type}${scope ? `(${scope})` : ""}: ${subject} by **<u>${owner}</u>** in ${shortHash}\n`;
        }
      },
      "preset": {
        "name": "conventionalcommits",
        "types": [
          {
            "type": "feat",
            "section": "🚀 Features",
          },
          {
            "type": "fix",
            "section": "🐞 Bug Fixes",
          },
          {
            "type": "chore",
            "section": "🧹 Chores",
          },
          {
            "type": "docs",
            "section": "📚 Documentation",
          },
          {
            "type": "refactor",
            "section": "🔧 Refactoring",
          },
          {
            "type": "perf",
            "section": "⚡ Performance",
          },
          {
            "type": "test",
            "section": "✅ Tests",
          },
          {
            "type": "style",
            "section": "🎨 Styles",
          }
        ]
      }
    }
  }
} satisfies Config;
