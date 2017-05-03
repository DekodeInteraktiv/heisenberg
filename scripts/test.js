'use strict';

process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

/**
 * Makes the script crash on unhandled rejections instead of silently
 * ignoring them.
 */
process.on( 'unhandledRejection', err => {
	throw err;
});

const jest = require( 'jest' );
const argv = process.argv.slice( 2 );

// Watch unless on CI or in coverage mode
if ( ! process.env.CI && argv.indexOf( '--coverage' ) < 0 ) {
	argv.push( '--watch' );
}

// This is not necessary after eject because we embed config into package.json.
const createJestConfig = require( './utils/create-jest-config' );
const path = require( 'path' );
const paths = require( '../config/paths' );
argv.push(
	'--config',
	JSON.stringify(
		createJestConfig(
			relativePath => path.resolve( __dirname, '..', relativePath ),
			path.resolve( paths.appSrc, '..' )
		)
	)
);

jest.run( argv );
