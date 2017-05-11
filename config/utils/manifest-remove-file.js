'use strict';

/**
 * External dependencies
 */
const _ = require( 'lodash' );
const fs = require( 'fs-extra' );

/**
 * Internal dependencies
 */
const paths = require( '../../config/paths' );

/**
 * Variables
 */
const manifestExists = fs.existsSync( paths.appManifest );
const manifest = manifestExists ? require( paths.appManifest ) : {};

/**
 * Function
 */
module.exports = ( req, res, match ) => {
	if ( ! manifestExists ) {
		return match;
	}

	let isManifestFile = false;

	_.forEach( _.values( manifest ), value => {
		if ( match.includes( value ) ) {
			isManifestFile = true;
			return false;
		}
	});

	return isManifestFile ? '' : match;
}
