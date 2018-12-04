/**
 * Do this as the first thing so that any code reading it knows the right env.
 */
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

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
const chalk = require( 'chalk' );
const formatWebpackMessages = require( 'react-dev-utils/formatWebpackMessages' );
const printBuildError = require( 'react-dev-utils/printBuildError' );
const webpack = require( 'webpack' );

/**
 * Internal dependencies
 */
const { checkBrowsers } = require( '../utils/check-browserslist' );
const { FILENAMES } = require( '../utils/get-filenames' );
const config = require( '../config/webpack.config.prod' );
const createWebpackConfig = require( '../utils/create-webpack-config' );

checkBrowsers()
	.then( async function() {
		const webpackConfig = await createWebpackConfig( config( FILENAMES ) );
		const compiler = webpack( webpackConfig );

		compiler.watch( {}, ( err, stats ) => {
			if ( err ) {
				console.log( chalk.red( 'Failed to compile.\n' ) );
				printBuildError( err );
				process.exit( 1 );
			}

			const messages = formatWebpackMessages(
				stats.toJson( { all: false, warnings: true, errors: true } )
			);

			if ( messages.warnings.length ) {
				console.log( chalk.yellow( 'Compiled with warnings.\n' ) );
				console.log( messages.warnings.join( '\n\n' ) );
				console.log( `\nSearch for the ${ chalk.underline( chalk.yellow( 'keywords' ) ) } to learn more about each warning.` );
				console.log( `To ignore, add ${ chalk.cyan( '// eslint-disable-next-line' ) } to the line before.\n` );
			} else {
				console.log( chalk.green( 'Compiled successfully.' ) );
			}

			console.log( 'Watching files...\n' );
		} );
	} );
