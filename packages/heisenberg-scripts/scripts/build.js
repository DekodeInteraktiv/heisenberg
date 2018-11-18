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
const FileSizeReporter = require( 'react-dev-utils/FileSizeReporter' );
const formatWebpackMessages = require( 'react-dev-utils/formatWebpackMessages' );
const webpack = require( 'webpack' );

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

/**
 * Internal dependencies
 */
const { checkBrowsers } = require( '../utils/check-browserslist' );
const { resolveRoot } = require( '../utils/paths' );
const config = require( '../config/webpack.config.prod' );
const createWebpackConfig = require( '../utils/create-webpack-config' );
const getHeisenbergConfig = require( '../utils/config' );

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

/**
 * Build script.
 */
async function build( previousFileSizes ) {
	console.log( 'Creating an optimized production build...' );

	const webpackConfig = await createWebpackConfig( config );
	const compiler = webpack( webpackConfig );

	return new Promise( ( resolve, reject ) => {
		compiler.run( ( err, stats ) => {
			if ( err ) {
				return reject( err );
			}

			const messages = formatWebpackMessages(
				stats.toJson( { all: false, warnings: true, errors: true } )
			);

			if ( messages.errors.length ) {
				// Only keep the first error. Others are often indicative
				// of the same problem, but confuse the reader with noise.
				if ( messages.errors.length > 1 ) {
					messages.errors.length = 1;
				}

				return reject( new Error( messages.errors.join( '\n\n' ) ) );
			}

			if ( process.env.CI && ( typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') && messages.warnings.length ) {
				console.log(
					chalk.yellow( '\nTreating warnings as errors because process.env.CI = true.\nMost CI servers set it automatically.\n' )
				);

				return reject( new Error( messages.warnings.join( '\n\n' ) ) );
			}

			resolve( {
				previousFileSizes,
				stats,
				warnings: messages.warnings,
			} );
		} );
	} );
}

checkBrowsers()
	.then( getHeisenbergConfig )
	.then( ( { dest } ) => {
		// First, read the current file sizes in build directory.
		// This lets us display how much they changed later.
		return measureFileSizesBeforeBuild( resolveRoot( dest ) );
	} )
	.then( ( previousFileSizes ) => {
		return build( previousFileSizes );
	} )
	.then( ( { stats, warnings, previousFileSizes } ) => {
		if ( warnings.length ) {
			console.log( chalk.yellow( 'Compiled with warnings.\n' ) );
			console.log( warnings.join( '\n\n' ) );
			console.log( `\nSearch for the ${ chalk.underline( chalk.yellow( 'keywords' ) ) } to learn more about each warning.` );
			console.log( `To ignore, add ${ chalk.cyan( '// eslint-disable-next-line' ) } to the line before.\n` );
		} else {
			console.log( chalk.green( 'Compiled successfully.\n' ) );
		}

		printFileSizesAfterBuild(
			stats,
			previousFileSizes,
			previousFileSizes.root,
			WARN_AFTER_BUNDLE_GZIP_SIZE,
			WARN_AFTER_CHUNK_GZIP_SIZE
		);
		console.log();
	} )
	.catch( err => {
		if ( err && err.message ) {
			console.log(err.message);
		}

		process.exit(1);
	} );
