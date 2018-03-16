const merge = require( 'merge' );

module.exports = {
	plugins: [ 'import', 'flowtype' ],

	env: {
		es6: true,
		browser: true,
		node: true,
	},

	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module',
		ecmaFeatures: {
			generators: true,
			experimentalObjectRestSpread: true,
		},
	},

	rules: merge(
		require( './rules/best-practices' ),
		require( './rules/es6' ),
		require( './rules/possible-errors' ),
		require( './rules/stylistic-issues' ),
		require( './rules/variables' )
	),
};
