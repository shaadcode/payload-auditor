# Changelog

## <small>1.8.3 (2025-10-29)</small>

* chore: add build script (#11) ([f05699f](https://github.com/shaadcode/payload-auditor/commit/f05699f)), closes [#11](https://github.com/shaadcode/payload-auditor/issues/11)
* chore: add release-it changelog pkg ([bd49d3f](https://github.com/shaadcode/payload-auditor/commit/bd49d3f))
* chore: bump version (#13) ([eabfac7](https://github.com/shaadcode/payload-auditor/commit/eabfac7)), closes [#13](https://github.com/shaadcode/payload-auditor/issues/13)
* chore: change ref branch (#14) ([0b95876](https://github.com/shaadcode/payload-auditor/commit/0b95876)), closes [#14](https://github.com/shaadcode/payload-auditor/issues/14)
* chore: change release branch (#12) ([041e2c4](https://github.com/shaadcode/payload-auditor/commit/041e2c4)), closes [#12](https://github.com/shaadcode/payload-auditor/issues/12)
* chore: placing the @payloadcms/translations library as a development dependency ([1e61f63](https://github.com/shaadcode/payload-auditor/commit/1e61f63))
* chore: release v1.8.2 (#15) ([009ab55](https://github.com/shaadcode/payload-auditor/commit/009ab55)), closes [#15](https://github.com/shaadcode/payload-auditor/issues/15)
* chore: update changelog preset ([6b943f9](https://github.com/shaadcode/payload-auditor/commit/6b943f9))
* Chore/improved plugin development and testing environment ([bcd23fd](https://github.com/shaadcode/payload-auditor/commit/bcd23fd))
* Docs/add contributing guide (#9) ([cfdfeea](https://github.com/shaadcode/payload-auditor/commit/cfdfeea)), closes [#9](https://github.com/shaadcode/payload-auditor/issues/9)
* perf(build): update release workflow (#7) ([376d3a3](https://github.com/shaadcode/payload-auditor/commit/376d3a3)), closes [#7](https://github.com/shaadcode/payload-auditor/issues/7)
* build: run the build script before each commit ([f47a0dd](https://github.com/shaadcode/payload-auditor/commit/f47a0dd))

## <small>1.8.2 (2025-10-29)</small>

* chore: add build script (#11) ([f05699f](https://github.com/shaadcode/payload-auditor/commit/f05699f)), closes [#11](https://github.com/shaadcode/payload-auditor/issues/11)
* chore: add release-it changelog pkg ([bd49d3f](https://github.com/shaadcode/payload-auditor/commit/bd49d3f))
* chore: bump version (#13) ([eabfac7](https://github.com/shaadcode/payload-auditor/commit/eabfac7)), closes [#13](https://github.com/shaadcode/payload-auditor/issues/13)
* chore: change ref branch (#14) ([0b95876](https://github.com/shaadcode/payload-auditor/commit/0b95876)), closes [#14](https://github.com/shaadcode/payload-auditor/issues/14)
* chore: change release branch (#12) ([041e2c4](https://github.com/shaadcode/payload-auditor/commit/041e2c4)), closes [#12](https://github.com/shaadcode/payload-auditor/issues/12)
* chore: placing the @payloadcms/translations library as a development dependency ([1e61f63](https://github.com/shaadcode/payload-auditor/commit/1e61f63))
* Chore/improved plugin development and testing environment ([bcd23fd](https://github.com/shaadcode/payload-auditor/commit/bcd23fd))
* Docs/add contributing guide (#9) ([cfdfeea](https://github.com/shaadcode/payload-auditor/commit/cfdfeea)), closes [#9](https://github.com/shaadcode/payload-auditor/issues/9)
* perf(build): update release workflow (#7) ([376d3a3](https://github.com/shaadcode/payload-auditor/commit/376d3a3)), closes [#7](https://github.com/shaadcode/payload-auditor/issues/7)
* build: run the build script before each commit ([f47a0dd](https://github.com/shaadcode/payload-auditor/commit/f47a0dd))

# [1.8.0](https://github.com/shaadcode/payload-auditor/compare/v1.7.0...v1.8.0) (2025-05-26)


### Bug Fixes

* **core:** fixed the error where logs were not saved due to authentication ([a63867c](https://github.com/shaadcode/payload-auditor/commit/a63867c571d78d4ef5df1564c72f51fafefee019))


### Features

* **config:** added internationalization capability ([15955ec](https://github.com/shaadcode/payload-auditor/commit/15955ecb14e0e60db9768ff1d5234aeb9cabbecb))
* **core:** add full plugin root collection customization capability ([fbe0ed9](https://github.com/shaadcode/payload-auditor/commit/fbe0ed9fd6cec8a63a649587b7fdd349fd38fbac))
* **logger:** enabling all operations within a hook with the `enabled` property ([7132ba6](https://github.com/shaadcode/payload-auditor/commit/7132ba64fc317c9380f35f09416a3641ab691fad))

# [1.7.0](https://github.com/shaadcode/payload-auditor/compare/v1.6.0...v1.7.0) (2025-05-20)


### Features

* **hooks:** add the ability to specify the number of logs to delete ([8c2679b](https://github.com/shaadcode/payload-auditor/commit/8c2679b1878646e2e84b310eb6fca32241036bd0))
* **logger:** added ability to customize log content ([5e1959b](https://github.com/shaadcode/payload-auditor/commit/5e1959b376d4b78dc1c4fb62f17cd554f946629e))


### Performance Improvements

* **core:** improved access to collection logs ([604c8d3](https://github.com/shaadcode/payload-auditor/commit/604c8d3f062eefee640089ba8f23816bfdfda6b9))
* **core:** improved log deletion performance ([b791072](https://github.com/shaadcode/payload-auditor/commit/b791072206634d2f0401142ed90736ec962c7361))

# [1.6.0](https://github.com/shaadcode/payload-auditor/compare/v1.5.1...v1.6.0) (2025-05-18)


### Bug Fixes

* **config:** fixed crash when not defining a collection during configuration ([128bebd](https://github.com/shaadcode/payload-auditor/commit/128bebd39f5d79108501e766e8cfaa0a1142bee3))


### Features

* **core:** add debug mode for buffer management ([1385112](https://github.com/shaadcode/payload-auditor/commit/1385112dfa7ff6bf8ae4460b055496621f5566cd))
* **logger:** add debug mode to check logs at the hook and operation level ([8eefe21](https://github.com/shaadcode/payload-auditor/commit/8eefe21733fb897d7f44d98c8467a85576bd208b))

## [1.5.1](https://github.com/shaadcode/payload-auditor/compare/v1.5.0...v1.5.1) (2025-05-15)


### Bug Fixes

* **config:** fix crashing the entire application when the user does not create a collection ([34cecb8](https://github.com/shaadcode/payload-auditor/commit/34cecb86eef1fbdc2bce31282e9570aee7793f3d))
* **core:** fix not receiving custom slug in plugin core ([83bd150](https://github.com/shaadcode/payload-auditor/commit/83bd15049fd7e9ccae9e99d5e90fb9075c33872e))
* fix missing types for plugin configuration ([4bc398e](https://github.com/shaadcode/payload-auditor/commit/4bc398ed2840761049a2659632a27f231beaf6fb))
* **testing:** fix test errors ([a325bd7](https://github.com/shaadcode/payload-auditor/commit/a325bd700605474be55a8169adecc18e98518b21))

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
