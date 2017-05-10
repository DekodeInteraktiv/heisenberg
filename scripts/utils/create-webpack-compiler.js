'use strict';

const chalk = require( 'chalk' );
const webpack = require( 'webpack' );
const clearConsole = require( 'react-dev-utils/clearConsole' );
const formatWebpackMessages = require( 'react-dev-utils/formatWebpackMessages' );
const bs = require( 'browser-sync' );
const paths = require( '../../config/paths' );

const isInteractive = process.stdout.isTTY;
let handleCompile;

module.exports = function createWebpackCompiler( config, onReadyCallback ) {
	// "Compiler" is a low-level interface to Webpack.
	// It lets us listen to some events and provide our own custom messages.
	let compiler;
	const browserSync = bs.create( 'heisenberg-browser-sync' );

	try {
		compiler = webpack( config, handleCompile );
	} catch ( err ) {
		console.log( chalk.red( 'Failed to compile.' ) );
		console.log();
		console.log( err.message || err );
		console.log();
		process.exit( 1 );
	}

	// "invalid" event fires when you have changed a file, and Webpack is
	// recompiling a bundle. WebpackDevServer takes care to pause serving the
	// bundle, so if you refresh, it'll wait instead of serving the old one.
	// "invalid" is short for "bundle invalidated", it doesn't imply any errors.
	compiler.plugin( 'invalid', () => {
		if ( isInteractive ) {
			clearConsole();
		}

		browserSync.notify( 'Compiling...' );
		console.log( 'Compiling...' );
	});

	let isFirstCompile = true;
	let isBrowserSyncRunning = false;

	// "done" event fires when Webpack has finished recompiling the bundle.
	// Whether or not you have warnings or errors, you will get this event.
	compiler.plugin( 'done', stats => {
		if ( isInteractive ) {
			clearConsole();
		}

		// We have switched off the default Webpack output in WebpackDevServer
		// options so we are going to "massage" the warnings and errors and present
		// them in a readable focused way.
		const messages = formatWebpackMessages( stats.toJson({}, true ) );
		const isSuccessful = ! messages.errors.length && !messages.warnings.length;
		const showInstructions = isSuccessful && ( isInteractive || isFirstCompile );

		if ( isSuccessful ) {
			console.log( chalk.green( 'Compiled successfully!' ) );
			browserSync.notify( 'Compiled successfully!' );
		}

		if ( typeof onReadyCallback === 'function' ) {
			onReadyCallback( showInstructions );
		}

		isFirstCompile = false;

		if ( ! isBrowserSyncRunning ) {
			browserSync.init({
				host: 'localhost',
				port: 3000,
				proxy: {
					target: require( paths.appPackageJson ).proxy,
				},
				codeSync: false,
				timestamps: false,
				logLevel: 'silent',
			});
			isBrowserSyncRunning = true;
		}

		// If errors exist, only show errors.
		if ( messages.errors.length ) {
			browserSync.notify( 'Failed to compile.' );
			console.log( chalk.red( 'Failed to compile.' ) );
			console.log();
			messages.errors.forEach( message => {
				console.log( message );
				console.log();
			});

			return;
		}

		// Show warnings if no errors were found.
		if ( messages.warnings.length ) {
			browserSync.notify( 'Compiled with warnings.' );
			console.log( chalk.yellow( 'Compiled with warnings.' ) );
			console.log();
			messages.warnings.forEach( message => {
				console.log( message );
				console.log();
			});
		}
	});

	return compiler;
};
