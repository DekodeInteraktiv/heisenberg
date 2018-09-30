/**
 * External dependencies
 */
const UnminifiedWebpackPlugin = require( 'unminified-webpack-plugin' );

module.exports = ( config, env ) => {
	if ( env === 'production' ) {
		config.plugins.push(
			new UnminifiedWebpackPlugin( {
				exclude: /\.(scss|css)$/,
			} )
		);
	}

	return config;
};
