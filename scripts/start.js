'use strict';

/**
 * Do this as the first thing so that any code reading it knows the right env.
 */
process.env.NODE_ENV = 'development';

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them.
 */
process.on( 'unhandledRejection', err => {
	throw err;
});

/**
 * External dependencies
 */
const _ = require( 'lodash' );
const {
	choosePort,
	prepareUrls,
} = require( 'react-dev-utils/WebpackDevServerUtils' );
const chalk = require( 'chalk' );
const clearConsole = require( 'react-dev-utils/clearConsole' );
const createWebpackCompiler = require( './utils/create-webpack-compiler' );
const detect = require( '@timer/detect-port' );
const getProcessForPort = require( 'react-dev-utils/getProcessForPort' );
const validator = require( 'validator' );
const WebpackDevServer = require( 'webpack-dev-server' );

/**
 * Internal dependencies
 */
const config = require( '../config/webpack.config.dev' );
const devServerConfig = require( '../config/webpackDevServer.config' );
const paths = require( '../config/paths' );

/**
 * Variables
 */
const isInteractive = process.stdout.isTTY;
const proxy = _.trim( require( paths.appPackageJson ).proxy );
const DEFAULT_PORT = parseInt( process.env.PORT, 10 ) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Check if proxy url is valid
 */
if ( ! proxy ) {
	console.log();
	console.log( chalk.red( 'The `proxy` field is not defined in your `package.json`' ) );
	console.log();
	process.exit( 1 );
}

if ( ! validator.isURL( proxy, { require_protocol: true } ) ) {
	console.log();
	console.log( chalk.red( 'The proxy is not a valid url' ) );
	console.log();
	process.exit( 1 );
}

function run( port ) {
	detect( 3100, HOST ).then( devPort => {
		const urls = prepareUrls( 'http', HOST, devPort );
		const urlsBS = prepareUrls( 'http', HOST, port );

		/**
		 * Create a webpack compiler that is configured with custom messages.
		 */
		const compiler = createWebpackCompiler(
			port,
			devPort,
			config,
			function onReady( showInstructions ) {
				if ( ! showInstructions ) {
					return;
				}

				console.log();
				console.log( 'The site is running at:' );
				console.log();

				if ( urlsBS.lanUrlForTerminal ) {
					console.log(
						`  ${chalk.bold('Local:')}            ${urlsBS.localUrlForTerminal}`
					);
					console.log(
						`  ${chalk.bold('On Your Network:')}  ${urlsBS.lanUrlForTerminal}`
					);
				} else {
					console.log(`  ${urlsBS.localUrlForTerminal}`);
				}
				console.log();
				console.log( chalk.dim( `  ${chalk.bold('Proxying:')} ${proxy}` ) );
				console.log();
				console.log( 'Note that the development build is not optimized.' );
				console.log(
					`To create a production build, use ${chalk.cyan( 'yarn build' )}.`
				);
				console.log();
			}
		);

		// Serve webpack assets generated by the compiler over a web sever.
		const devServer = new WebpackDevServer( compiler, devServerConfig( HOST, urls.lanUrlForConfig ) );

		// Launch WebpackDevServer.
		devServer.listen( devPort, HOST, err => {
			if ( err ) {
				return console.log( err );
			}

			if ( isInteractive ) {
				clearConsole();
			}

			console.log( chalk.cyan( 'Starting the development server...' ) );
			console.log();
		});
	});
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePort( HOST, DEFAULT_PORT ).then( port => {
	if ( port == null ) {
		// We have not found a port.
		return;
	}

	run( port );
});
