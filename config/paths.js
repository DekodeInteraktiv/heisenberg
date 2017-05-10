'use strict';

const path = require( 'path' );
const fs = require( 'fs' );

const appDirectory = fs.realpathSync( process.cwd() );
function resolveApp( relativePath ) {
	return path.resolve( appDirectory, relativePath );
}

module.exports = {
	resolveApp,
	appBuild: resolveApp( 'dist' ),
	appManifest: resolveApp( 'dist/assets.json' ),
	appNodeModules: resolveApp( 'node_modules' ),
	appPackageJson: resolveApp( 'package.json' ),
	appPublic: resolveApp( 'public' ),
	appImages: resolveApp( 'src/images' ),
	appSrc: resolveApp( 'src' ),
	testsSetup: resolveApp( 'src/setupTests.js' ),
};
