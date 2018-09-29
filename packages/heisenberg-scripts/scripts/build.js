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
 * Internal dependencies
 */
const getHeisenbergConfig = require( '../utils/config' );

/**
 * Build script.
 */
async function build() {
	console.log( 'Creating an optimized production build...' );

	const config = await getHeisenbergConfig();

	console.log( config );
}

build();
