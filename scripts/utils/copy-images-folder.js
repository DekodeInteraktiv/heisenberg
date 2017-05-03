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
module.exports = () => {
	if ( fs.existsSync( paths.appImages ) ) {
		fs.copySync( paths.appImages, `${paths.appBuild}/images`, {
			dereference: true,
		});
	}
};
