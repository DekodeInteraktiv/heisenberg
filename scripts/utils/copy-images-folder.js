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
	fs.copySync( paths.appImages, `${paths.appBuild}/images`, {
		dereference: true,
	});
};
