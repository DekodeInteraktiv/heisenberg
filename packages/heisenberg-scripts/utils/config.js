/**
 * External dependencies
 */
const cosmiconfig = require( 'cosmiconfig' );
const merge = require( 'deepmerge' );

/**
 * Internal dependencies
 */
const config = require( '../config/heisenberg.config' );
const { rootDirectory } = require( './paths' );

module.exports = () => new Promise( ( resolve, reject ) => {
	const explorer = cosmiconfig( 'heisenberg', {
		rcExtensions: true,
	} );

	explorer.search( rootDirectory ).then( customConfig => {
		if ( customConfig && customConfig.config ) {
			resolve( merge( config, customConfig.config ) );
		} else {
			resolve( config );
		}
	} )
		.catch( err => {
			reject( err );
		} );
} );
