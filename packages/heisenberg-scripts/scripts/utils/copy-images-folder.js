/**
 * External dependencies
 */
const fs = require( 'fs-extra' );

/**
 * Internal dependencies
 */
const paths = require( '../../config/paths' );

/**
 * Function
 */
module.exports = ( dest ) => {
	if ( fs.existsSync( paths.appImages ) ) {
		fs.copySync( paths.appImages, `${dest}/images`, {
			dereference: true,
		});
	}
};
