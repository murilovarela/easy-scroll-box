module.exports = {
	'env': {
		'browser': true,
		'node': true,
		'es6': true,
    'amd': true,
		"jest": true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/all',
		'plugin:prettier/recommended',
	],
	'settings': {
    'react': {
      'pragma': 'React',
      'version': 'detect',
    },
	},
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'react',
		'prettier',
		'react-hooks'
	],
	'rules': {
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single',
			{ "avoidEscape": true, "allowTemplateLiterals": false }
		],
		'react/react-in-jsx-scope': ['off'],
		'react/display-name': ['off'],
		'react/jsx-indent': ['off'],
		'react/jsx-one-expression-per-line': ['off'],
		'react/jsx-max-props-per-line': ['off'],
		'react/jsx-no-literals': ['off'],
		'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
		'react/require-optimization': ['off'],
		'react/no-set-state': ['off'],
		'react/jsx-indent-props': ['off'],
		'react/button-has-type': ['off'],
		'react/jsx-max-depth': ['off'],
		'react/jsx-props-no-spreading': ['off'],
		'react/forbid-prop-types': ['off'],
		'react/jsx-sort-props': ['off'],
		'react/no-array-index-key': ['off']
	}
}
