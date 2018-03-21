'use strict';

/**
 * External dependencies
 */
const chalk = require( 'chalk' );
const filesize = require( 'filesize' );
const fs = require( 'fs' );
const gzipSize = require( 'gzip-size' ).sync;
const path = require( 'path' );
const recursive = require( 'recursive-readdir' );
const stripAnsi = require( 'strip-ansi' );
const _ = require( 'lodash' );

// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel( currentSize, previousSize ) {
	const FIFTY_KILOBYTES = 1024 * 50;
	const difference = currentSize - previousSize;
	const fileSize = ! Number.isNaN( difference ) ? filesize( difference ) : 0;

	if ( difference >= FIFTY_KILOBYTES ) {
		return chalk.red( `+${fileSize}` );
	} else if ( difference < FIFTY_KILOBYTES && 0 < difference ) {
		return chalk.yellow( `+${fileSize}` );
	} else if ( 0 > difference ) {
		return chalk.green( fileSize );
	}

	return '';
}

function removeFileNameHash( buildFolder, fileName ) {
	return fileName
		.replace( buildFolder, '' )
		.replace( /\/?(.*)(\.\w+)(\.js|\.css)/, ( match, p1, p2, p3 ) => p1 + p3 );
}

// Prints a detailed summary of build files.
function printFileSizesAfterBuild( webpackStats, previousSizeMap, dest ) {
	const root = previousSizeMap.root;
	const sizes = previousSizeMap.sizes;

	const assets = webpackStats
		.toJson()
		.assets.filter( asset => /\.(js|css)$/.test( asset.name ) )
		.map( asset => {
			const fileContents = fs.readFileSync( path.join( root, asset.name ) );
			const size = gzipSize( fileContents );
			const previousSize = sizes[removeFileNameHash( root, asset.name )];
			const difference = getDifferenceLabel( size, previousSize );

			return {
				chunkNames: asset.chunkNames,
				folder: path.join( dest, path.dirname( asset.name ) ),
				name: path.basename( asset.name ),
				size,
				sizeLabel: filesize( size ) + ( difference ? ` (${difference})` : '' ),
			};
		});

	const longestSizeLabelLength = Math.max.apply(
		null,
		assets.map( asset => stripAnsi( asset.sizeLabel ).length )
	);

	const longestChunkLabelLength = Math.max.apply(
		null,
		assets.map( asset => stripAnsi( asset.chunkNames[0] ).length )
	);

	const sortedAssets = _.orderBy( assets, [ asset => asset.folder + path.sep + asset.name.toLowerCase() ], [ 'asc' ] );
	let prevFiletype = null;

	sortedAssets.forEach( asset => {
		if ( prevFiletype !== asset.folder ) {
			console.log();

			switch (asset.folder) {
				case 'dist/css':
					console.log( chalk.cyan( '  Stylesheets:  ' ) );
					break;
				case 'dist/js':
					console.log( chalk.cyan( '  JavaScripts:  ' ) );
					break;
			}

			prevFiletype = asset.folder;
		}

		let chunkLabel = asset.chunkNames[0];
		const chunkLength = stripAnsi( chunkLabel ).length;

		if ( chunkLength < longestChunkLabelLength ) {
			const chunkRightPadding = ' '.repeat( longestChunkLabelLength - chunkLength );
			chunkLabel += chunkRightPadding;
		}

		let sizeLabel = asset.sizeLabel;
		const sizeLength = stripAnsi( sizeLabel ).length;

		if ( sizeLength < longestSizeLabelLength ) {
			const sizeRightPadding = ' '.repeat( longestSizeLabelLength - sizeLength );
			sizeLabel += sizeRightPadding;
		}

		console.log( `  ${chalk.green( chunkLabel )}   ${sizeLabel}   ${chalk.dim( asset.folder + path.sep + asset.name )}` );
	});
}

function measureFileSizesBeforeBuild( buildFolder ) {
	return new Promise( resolve => {
		recursive( buildFolder, ( err, fileNames ) => {
			let sizes;

			if ( ! err && fileNames ) {
				sizes = fileNames
					.filter( fileName => /\.(js|css)$/.test( fileName ) )
					.reduce(
						( memo, fileName ) => {
							const contents = fs.readFileSync( fileName );
							const key = removeFileNameHash( buildFolder, fileName );
							memo[key] = gzipSize( contents );
							return memo;
						},
						{}
					);
			}

			resolve({
				root: buildFolder,
				sizes: sizes || {},
			});
		});
	});
}

module.exports = {
	measureFileSizesBeforeBuild,
	printFileSizesAfterBuild,
};
