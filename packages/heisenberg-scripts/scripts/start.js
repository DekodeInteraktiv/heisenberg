/**
 * Do this as the first thing so that any code reading it knows the right env.
 */
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them.
 */
process.on( 'unhandledRejection', err => {
	throw err;
} );

/**
 * External dependencies
 */
const { choosePort } = require( 'react-dev-utils/WebpackDevServerUtils' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const chalk = require( 'chalk' );
const webpack = require( 'webpack' );

/**
 * Internal dependencies
 */
const { checkBrowsers } = require( '../utils/check-browserslist' );
const getHeisenbergConfig = require( '../utils/config' );
const createWebpackConfig = require( '../utils/create-webpack-config' );
const config = require( '../config/webpack.config.dev' );
require( '../utils/env' );

const DEFAULT_PORT = parseInt( process.env.PORT, 10 ) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const FILENAMES = {
	css: '[name].min.css',
	media: 'static/[name].[ext]',
	output: '[name].min.js',
};

checkBrowsers()
	.then( () => {
		return choosePort( HOST, DEFAULT_PORT );
	} )
	.then( async port => {
		if ( port == null ) {
			// We have not found a port.
			return;
		}

		const heisenbergConfig = await getHeisenbergConfig();
		const proxy = process.env.HEISENBERG_PROXY || heisenbergConfig.proxy;

		if ( ! proxy ) {
			console.log( chalk.red( 'No proxy url defined.\n' ) );
			process.exit( 1 );
		}

		const webpackConfig = await createWebpackConfig( config( FILENAMES ) );
		webpackConfig.plugins.push( new BrowserSyncPlugin( {
			host: HOST,
			port,
			proxy,
			notify: {
				styles: {
					backgroundColor: '#000',
					borderBottomLeftRadius: 0,
					bottom: 0,
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
					fontSize: '14px',
					fontWeight: 400,
					left: 0,
					padding: '5px',
					right: 'auto',
					top: 'auto',
				},
			},
		} ) );

		const compiler = webpack( webpackConfig );

		compiler.watch( {}, () => {
			console.log( 'Watching files...' );
		} );
	} );
