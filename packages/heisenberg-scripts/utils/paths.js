/**
 * External dependencies
 */
const path = require( 'path' );
const fs = require( 'fs' );

/**
 * Variables
 */
const rootDirectory = fs.realpathSync( process.cwd() );

/**
 * Resolve path helper.
 *
 * @param {string} relativePath Path to file.
 * @return {string} Absolute path to file.
 */
function resolveRoot( relativePath ) {
	return path.resolve( path.join( rootDirectory, relativePath ) );
}

module.exports = {
	resolveRoot,
	rootDirectory,
};
