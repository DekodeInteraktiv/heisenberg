/**
 * External dependencies
 */
const cosmiconfig = require( 'cosmiconfig' );

/**
 * Internal dependencies
 */
const paths = require( '../../config/paths' );

/**
 * Default config
 */
const defaultConfig = {
	icons: {},
	build: {},
};

/**
 * Find Heisenberg config.
 */
module.exports = ( key = false ) => new Promise( (resolve, reject) => {
	cosmiconfig( 'heisenberg', { rcExtensions: true } ).load( paths.appDirectory ).then( config => {
		if ( config && config.config ) {
			const mergedConfig = Object.assign( defaultConfig, config.config );

			if ( ! key ) {
				resolve( mergedConfig );
			} else if ( mergedConfig.hasOwnProperty( key ) ) {
				resolve( mergedConfig[ key ] );
			} else {
				reject( 'Config key not found' );
			}

		} else {
			resolve( defaultConfig );
		}
	} ).catch( err => {
		reject( err );
	} );
} );
