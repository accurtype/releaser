/** @type {import('eslint').ESLint.ConfigData} */
const config = {
	parser: '@typescript-eslint/parser',
	extends: [
		'accurtype-style',
		'eslint:recommended',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:markdown/recommended',
	],
	plugins: [
		'@typescript-eslint',
		'markdown',
	],
	rules: { 'no-unused-vars': 'warn' },
	root: true,
	parserOptions: {
		project: ['./packages/*/tsconfig.json'],
		tsconfigRootDir: __dirname,
	},
	overrides: [
		{
			files: ['**/*.md/*'],
			extends: 'plugin:@typescript-eslint/disable-type-checked',
			rules: { 'expect-type/expect': 'off' },
		},
		{
			files: [
				'packages/test-pkgs/**/*',
				'packages/accureleaser/**/*',
			],
			env: { node: true },
		},
	],
};
module.exports = config;
