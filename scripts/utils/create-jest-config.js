'use strict';

const fs = require( 'fs' );
const paths = require( '../../config/paths' );

module.exports = ( resolve, rootDir ) => {
	const setupTestsFile = fs.existsSync( paths.testsSetup )
		? '<rootDir>/src/setupTests.js'
		: undefined;

	const config = {
		collectCoverageFrom: ['src/**/*.js'],
		setupFiles: [],
		setupTestFrameworkScriptFile: setupTestsFile,
		testPathIgnorePatterns: [
			'<rootDir>[/\\\\](dist|docs|node_modules|scripts)[/\\\\]',
		],
		testEnvironment: 'node',
		testURL: 'http://localhost',
		transform: {
			'^.+\\.(js|jsx)$': resolve( 'config/jest/babel-transform.js' ),
			'^.+\\.css$': resolve( 'config/jest/css-transform.js' ),
			'^(?!.*\\.(js|jsx|css|json)$)': resolve( 'config/jest/file-transform.js' ),
		},
		transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
	};

	if ( rootDir ) {
		config.rootDir = rootDir;
	}

	return config;
};
