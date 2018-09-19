/**
 * External dependencies
 */
const merge = require( 'merge' );

module.exports = {
	plugins: [ 'import', 'flowtype', 'heisenberg' ],

	env: {
		es6: true,
	},

	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module',
		ecmaFeatures: {
			generators: true,
		},
	},

	rules: merge(
		require( './rules/best-practices' ),
		require( './rules/esnext' ),
		require( './rules/possible-errors' ),
		require( './rules/stylistic-issues' ),
		require( './rules/variables' )
	),
};
