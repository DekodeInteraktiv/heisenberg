'use strict';

/**
 * External dependencies
 */
const path = require( 'path' );
const fs = require( 'fs' );

/**
 * Variables
 */
const appDirectory = fs.realpathSync( process.cwd() );

/**
 * Resolve path helper
 *
 * @param {string} relativePath Path to file.
 */
function resolveApp( relativePath ) {
	return path.resolve( appDirectory, relativePath );
}

module.exports = {
	appBuild: resolveApp( 'dist' ),
	appEslintConfig: resolveApp( '.eslintrc.js' ),
	appImages: resolveApp( 'src/images' ),
	appManifest: resolveApp( 'dist/assets.json' ),
	appNodeModules: resolveApp( 'node_modules' ),
	appPackageJson: resolveApp( 'package.json' ),
	appSrc: resolveApp( 'src' ),
	appDirectory,
	resolveApp,
};
