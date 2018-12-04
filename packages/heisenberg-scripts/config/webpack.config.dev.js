/**
 * External dependencies
 */
const merge = require( 'webpack-merge' );

/**
 * Internal dependencies
 */
const sharedConfig = require( './webpack.config.shared' );

module.exports = ( filenames ) => {
	const config = sharedConfig( filenames );

	return merge( config, {
		mode: 'development',
		devtool: 'eval',
		watch: true,
	} );
};
