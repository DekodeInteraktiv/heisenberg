'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on( 'unhandledRejection', err => {
	throw err;
});

/**
 * External dependencies
 */
const chalk = require( 'chalk' );
const fs = require( 'fs-extra' );
const webpack = require( 'webpack' );

/**
 * Internal dependencies
 */
const FileSizeReporter = require( './utils/file-size-reporter' );
const paths = require( '../config/paths' );
const printErrors = require( './utils/print-errors' );
const config = require( '../config/webpack.config.prod' );
const copyImagesFolder = require( './utils/copy-images-folder' );

/**
 * Build
 */
const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// Create the production build.
function build( previousFileSizes ) {
	console.log( 'Creating an optimized production build...' );

	let compiler;
	try {
		compiler = webpack( config );
	} catch ( err ) {
		printErrors( 'Failed to compile.', [err] );
		process.exit( 1 );
	}

	compiler.run( ( err, stats ) => {
		if ( err ) {
			printErrors( 'Failed to compile.', [err] );
			process.exit( 1 );
		}

		if ( stats.compilation.errors.length ) {
			printErrors( 'Failed to compile.', stats.compilation.errors );
			process.exit( 1 );
		}

		if ( process.env.CI && stats.compilation.warnings.length ) {
			printErrors(
				'Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.',
				stats.compilation.warnings
			);
			process.exit( 1 );
		}

		console.log( chalk.green( 'Compiled successfully.' ) );
		console.log();

		console.log( 'File sizes after gzip:' );
		printFileSizesAfterBuild( stats, previousFileSizes );
		console.log();
	});
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild( paths.appBuild ).then( previousFileSizes => {
	// Remove all content but keep the directory so that
	// if you're in it, you don't end up in Trash
	fs.emptyDirSync( paths.appBuild );

	// Start the webpack build
	build( previousFileSizes );

	// Copy images folder
	copyImagesFolder();
});
