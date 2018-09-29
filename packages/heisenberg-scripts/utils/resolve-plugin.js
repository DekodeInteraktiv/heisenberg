/**
 * External dependencies
 */
const path = require( 'path' );
const resolve = require( 'resolve' );

const HEISENBERG_PLUGIN_PREFIX_RE = /^(?!@|module:|[^/]+\/|heisenberg-plugin-)/;

function standardizeName( name ) {
	// Let absolute and relative paths through.
	if ( path.isAbsolute( name ) ) {
		return name;
	}

	return (
		name
			// foo -> heisenberg-plugin-foo
			.replace(
				HEISENBERG_PLUGIN_PREFIX_RE,
				'heisenberg-plugin-',
			)
	);
}

function resolvePlugin( name, dirname ) {
	const standardizedName = standardizeName( name );

	try {
		return resolve.sync( standardizedName, { basedir: dirname } );
	} catch ( err ) {
		throw err;
	}
}

module.exports = resolvePlugin;
