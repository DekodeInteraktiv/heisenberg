'use strict';

const path = require( 'path' );
const fs = require( 'fs' );

const appDirectory = fs.realpathSync( process.cwd() );
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
	appPublic: resolveApp( 'public' ),
	appSrc: resolveApp( 'src' ),
	appStylelintConfig: resolveApp( '.stylelintrc.js' ),
	resolveApp,
};
