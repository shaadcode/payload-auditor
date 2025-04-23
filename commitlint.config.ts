import type { UserConfig } from '@commitlint/types'

import { RuleConfigSeverity } from '@commitlint/types'

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'build', // 🏗️ Changes related to the build system or dependencies (e.g., Webpack, pnpm)
        // Example: Updating dependencies, changing build scripts

        'chore', // 🔧 Routine tasks or maintenance that don't affect production code
        // Example: Cleaning up configs, updating scripts, or editor settings

        'ci', // 🤖 Continuous Integration-related changes (e.g., GitHub Actions, GitLab CI)
        // Example: Adding a GitHub workflow file or fixing a CI build issue

        'docs', // 📚 Documentation changes only
        // Example: Updating README, adding comments, fixing typos

        'feat', // ✨ A new feature or significant enhancement
        // Example: Adding a new user role system or new API endpoint

        'fix', // 🐛 A bug fix
        // Example: Resolving login errors or fixing validation issues

        'perf', // ⚡️ Performance improvements
        // Example: Optimizing loops or refactoring queries for speed

        'refactor', // 🧹 Code changes that neither fix a bug nor add a feature
        // Example: Renaming variables, reorganizing code structure

        'revert', // ⏪ Reverting a previous commit
        // Example: Reverting a buggy release or undoing a mistake

        'style', // 💅 Code style changes with no logic impact
        // Example: Fixing indentation, removing console logs, updating formatting

        'test', // 🧪 Adding or updating tests
        // Example: Adding unit tests or modifying integration tests
      ],
    ],
  },
}

export default Configuration
