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
const formatWebpackMessages = require( 'react-dev-utils/formatWebpackMessages' );
const webpack = require( 'webpack' );

/**
 * Internal dependencies
 */
const { checkBrowsers } = require( '../utils/check-browserslist' );
const config = require( '../config/webpack.config.prod' );
const createWebpackConfig = require( '../utils/create-webpack-config' );

/**
 * Build script.
 */
async function build() {
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

			console.log( messages );

			resolve( {} );
		} );
	} );
}

checkBrowsers().then( build ).catch( err => {
	if ( err && err.message ) {
		console.log(err.message);
	}

	process.exit(1);
} );
