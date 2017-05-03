const paths = require( './paths' );

module.exports = {
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
	host: 'localhost',
	overlay: false,
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
};
