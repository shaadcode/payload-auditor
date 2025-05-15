# [1.5.0](https://github.com/shaadcode/payload-auditor/compare/v1.4.2...v1.5.0) (2025-05-15)


### Bug Fixes

* **build:** not including test files in the final build ([ec9b96a](https://github.com/shaadcode/payload-auditor/commit/ec9b96a7dcf33c9780913a4e8ece4753b3c64f7d))


### Features

* **core:** add the ability to change labels and slug for the plugin's internal collection ([e4d843d](https://github.com/shaadcode/payload-auditor/commit/e4d843d5f3aabcd4aafce60e04dde2d6844ebf1e))
* **logger:** add a hook type field ([af7b817](https://github.com/shaadcode/payload-auditor/commit/af7b817f020240e16ab689a08e41112135535cfb))
* **logger:** add a log type field for each hook ([2e51824](https://github.com/shaadcode/payload-auditor/commit/2e518240c84068d670d7184c2c16d2542a9729d6))

## [1.4.2](https://github.com/shaadcode/payload-auditor/compare/v1.4.1...v1.4.2) (2025-05-09)


### Bug Fixes

* **hooks:** fixed issue where me and refresh hooks were not logged ([78ab40c](https://github.com/shaadcode/payload-auditor/commit/78ab40ced47ea4ef6d8350b2d1f327d391d7b697))

## [1.4.1](https://github.com/shaadcode/payload-auditor/compare/v1.4.0...v1.4.1) (2025-05-05)


### Bug Fixes

* remove path ./vitest.config.ts from tsconfig ([996be1c](https://github.com/shaadcode/payload-auditor/commit/996be1c7f7b2631634f603fba21f12775e4bcea3))

# [1.4.0](https://github.com/shaadcode/payload-auditor/compare/v1.3.0...v1.4.0) (2025-05-05)


### Features

* **config:** buffer management for how logs are injected into the database ([dc57683](https://github.com/shaadcode/payload-auditor/commit/dc57683a63cfe9d4b1573c7938ffc1d59f372eef))
* **testing:** replacing jest with vitest ([74f9a87](https://github.com/shaadcode/payload-auditor/commit/74f9a873224033d8a3d4caf5c8f6b8b0cad8f385))
* **testing:** vitest supports typescript alias ([ed2b5db](https://github.com/shaadcode/payload-auditor/commit/ed2b5db77acad78a82720b7da4151d057bac078a))

# [1.3.0](https://github.com/shaadcode/payload-auditor/compare/v1.2.7...v1.3.0) (2025-05-03)


### Bug Fixes

* **core:** empty user and documentId fields in hooks ([859bf50](https://github.com/shaadcode/payload-auditor/commit/859bf50ee3430b2bf887910739471d6bdc5b5788))


### Features

* **config:** manage Access to the Main Collection Plugin ([74dc19b](https://github.com/shaadcode/payload-auditor/commit/74dc19b72190a114a7b0c7ad250929a42ce0c4bb))
* **core:** remove updatedAt field from audit logs schema ([0cf9a79](https://github.com/shaadcode/payload-auditor/commit/0cf9a798f8d44ea33c751f76a5dda3effff2a75a))

## <small>1.2.7 (2025-04-30)</small>

* fix(logger): unexpected logs generated in some hooks ([b5242df](https://github.com/shaadcode/payload-auditor/commit/b5242df))
* chore: pin Node.js version to 20.19.1 in .node-version file ([74cc802](https://github.com/shaadcode/payload-auditor/commit/74cc802))
* ci: add emoji to release notes ([5817951](https://github.com/shaadcode/payload-auditor/commit/5817951))

## [1.2.6](https://github.com/shaadcode/payload-auditor/compare/v1.2.5...v1.2.6) (2025-04-30)


### Bug Fixes

* restore correct version 1.2.5 ([4cef8c0](https://github.com/shaadcode/payload-auditor/commit/4cef8c0f550c6b7a510e40ee965c4b80a7c9e3e7))

# 1.0.0 (2025-04-30)


### Code Refactoring

* **core:** change the structure of the logging system and add more customization ([a4bbb5f](https://github.com/shaadcode/payload-auditor/commit/a4bbb5f48fb86bd6398693df2f80b225cced89d3))


### Features

* **hooks:** add all supported operations for the `afterOperation` hook ([ca0f18b](https://github.com/shaadcode/payload-auditor/commit/ca0f18b0e26d94eb48a9ab5f0684536aeed94242))
* initial commit ([82abc21](https://github.com/shaadcode/payload-auditor/commit/82abc21b9189472b9bfb7c9cc13a1a00da1bd6ed))


### BREAKING CHANGES

* **core:** -Add `collection` property for deeper configuration of collections section
