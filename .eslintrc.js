module.exports = {
	root: true,

	env: {
		node: true,
	},

	rules: {
		'no-console': 'off',
		'no-debugger': 'off',
		indent: ['error', 'tab'],
		'no-shadow': 'off',
		'no-tabs': 'off',
		'max-len': ['error', { code: 200 }],
		'no-param-reassign': 'off',
		'no-plusplus': 'off',
		'no-mixed-operators': 'off',
		'no-underscore-dangle': 'off',
	},

	parserOptions: {
		parser: 'babel-eslint',
	},

	extends: [
		'plugin:vue/essential',
		'@vue/airbnb',
	],
};
