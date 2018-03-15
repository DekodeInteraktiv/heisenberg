const merge = require( 'merge' );

module.exports = {
	env: {
		es6: true,
		browser: true,
		node: true,
	},

	rules: merge(
		require( './rules/best-practices' ),
		require( './rules/es6' ),
		require( './rules/possible-errors' ),
		require( './rules/stylistic-issues' ),
		require( './rules/variables' )
	),
};
