const { RuleConfigSeverity } = require('@commitlint/types');
const czConfig = require('./.cz-config');

const config = {
	/*
	 * Resolve and load conventional-changelog-atom from node_modules.
	 * Referenced packages must be installed
	 */
	// parserPreset: 'conventional-changelog-atom',
	/*
	 * Resolve and load @commitlint/format from node_modules.
	 * Referenced package must be installed
	 */
	// formatter: '@commitlint/format',
	/*
	 * Any rules defined here will override rules from @commitlint/config-conventional
	 */
	rules: {
		'body-leading-blank': [RuleConfigSeverity.Error, 'always'],
		'scope-enum': [RuleConfigSeverity.Error, 'always', czConfig.scopes.map(({ name }) => name)],
		'subject-empty': [RuleConfigSeverity.Error, 'never'],
		'type-enum': [RuleConfigSeverity.Error, 'always', czConfig.types.map(({ value }) => value)],
		'type-case': [RuleConfigSeverity.Error, 'always', 'pascal-case'],
		'type-empty': [RuleConfigSeverity.Error, 'never'],
	},
	/*
	 * Functions that return true if commitlint should ignore the given message.
	 */
	ignores: [commit => commit === ''],
	/*
	 * Whether commitlint uses the default ignore rules.
	 */
	defaultIgnores: false,
	/*
	 * Custom URL to show upon failure
	 */
	helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
	/*
	 * Custom prompt configs
	 */
	prompt: {
		messages: {},
		questions: { type: { description: 'please input type:' } },
	},
};
module.exports = config;
