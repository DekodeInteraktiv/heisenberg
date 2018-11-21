/**
 * External dependencies
 */
const { injectPlugin } = require( 'heisenberg-scripts' );
const UnminifiedWebpackPlugin = require( 'unminified-webpack-plugin' );

module.exports = ( config, env ) => {
	if ( env === 'production' ) {
		const unminifiedPlugin = new UnminifiedWebpackPlugin( {
			exclude: /\.(scss|css)$/,
		} );

		injectPlugin( config, unminifiedPlugin );
	}

	return config;
};
