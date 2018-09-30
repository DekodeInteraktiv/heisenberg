/**
 * External dependencies
 */
const UnminifiedWebpackPlugin = require( 'unminified-webpack-plugin' );
const { injectPlugin } = require( 'heisenberg-scripts' );

module.exports = ( config, env ) => {
	if ( env === 'production' ) {
		const unminifiedPlugin = new UnminifiedWebpackPlugin( {
			exclude: /\.(scss|css)$/,
		} );

		injectPlugin( config, unminifiedPlugin );
	}

	return config;
};
