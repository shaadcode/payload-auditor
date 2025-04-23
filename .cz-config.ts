import type { UserConfig } from '@commitlint/types'

import { RuleConfigSeverity } from '@commitlint/types'

const config: UserConfig = {
  allowBreakingChanges: ['feat', 'fix'],
  allowCustomScopes: true,
  customPrompt: async (cz, commit) => {
    const defaultConfig = await import('cz-git')
    const commitConfig = await defaultConfig.prompter(cz, commit)

    if (commitConfig && typeof commitConfig === 'object' && commitConfig.subject) {
      commitConfig.subject = commitConfig.subject.toLowerCase() + ' hello'
    }

    return commitConfig
  },

  messages: {
    type: "Select the type of change that you're committing:",
    body: 'Provide a longer description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any breaking changes (optional):\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
    footer: 'List any issues closed by this change (optional). E.g.: #31, #34:\n',
    scope: 'Denote the scope of this change (optional):',
    subject: 'Write a short, imperative tense description of the change:\n',
  },
  rules: {
    'subject-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
  },
  scopes: [
    { name: 'core', description: 'Main logic of the plugin (core functions, processors, etc.)' },
    { name: 'logger', description: 'Activity logging, log collection, and log-related features' },
    {
      name: 'config',
      description: 'Configuration files and logic (e.g., payload config, plugin setup)',
    },
    { name: 'cli', description: 'Command-line interface improvements or changes' },
    { name: 'hooks', description: 'Custom Payload CMS hooks (before/after change, etc.)' },
    { name: 'jobs', description: 'Jobs, scheduled tasks, or queue handling' },
    { name: 'ui', description: 'Admin UI customization or visual improvements' },
    { name: 'types', description: 'TypeScript type definitions and typings' },
    { name: 'docs', description: 'Documentation updates (README, inline docs, etc.)' },
    { name: 'ci', description: 'Continuous Integration (CI) configuration or scripts' },
    { name: 'release', description: 'Release-related changes (semantic versioning, changelogs)' },
    { name: 'testing', description: 'Test cases, mocks, or testing tools' },
    { name: 'deps', description: 'Dependency updates or changes in package.json' },
    { name: 'build', description: 'Build process, compilers, bundlers (e.g., SWC, TSC)' },
    { name: 'husky', description: 'Git hooks configuration using Husky' },
    { name: 'commitlint', description: 'Commit message linting rules and setup' },
    { name: 'semantic-release', description: 'Automated release configuration and logic' },
    { name: 'commitizen', description: 'Commitizen setup or prompt customization' },
  ],
  skipQuestions: [],
  types: [
    { name: 'feat:     A new feature', value: 'feat' },
    { name: 'fix:      A bug fix', value: 'fix' },
    { name: 'docs:     Documentation only changes', value: 'docs' },
    { name: 'style:    Code style changes (formatting, missing semicolons, etc.)', value: 'style' },
    { name: 'refactor: Code changes that neither fix bugs nor add features', value: 'refactor' },
    { name: 'perf:     Performance improvements', value: 'perf' },
    { name: 'test:     Adding or fixing tests', value: 'test' },
    { name: 'chore:    Maintenance, build tools, CI config, etc.', value: 'chore' },
  ],
}

export default config
