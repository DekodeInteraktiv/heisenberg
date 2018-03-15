const merge = require( 'merge' );

module.exports = {
	rules: merge(
		require( './rules/best-practices' ),
		require( './rules/es6' ),
		require( './rules/node' ),
		require( './rules/possible-errors' ),
		require( './rules/strict' ),
		require( './rules/stylistic-issues' ),
		require( './rules/variables' )
	),
};
