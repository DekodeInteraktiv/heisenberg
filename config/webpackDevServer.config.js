/**
 * Internal dependencies
 */
const paths = require( './paths' );

/**
 * Config
 */
module.exports = ( host ) => {
	return {
		compress: true,
		clientLogLevel: 'none',
		contentBase: paths.appPublic,
		watchContentBase: true,
		hot: true,
		publicPath: '/',
		quiet: true,
		watchOptions: {
			ignored: /node_modules/,
		},
		host: host,
		overlay: false,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	};
};
