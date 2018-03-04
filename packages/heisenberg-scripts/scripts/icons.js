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
const eachAsync = require( 'each-async' );
const fs = require( 'fs' );
const path = require( 'path' );
const SVGO = require( 'svgo' );

/**
 * Internal dependencies
 */
const getConfig = require( './utils/get-config' );
const paths = require( '../config/paths' );

function build( customConfig ) {
	const config = Object.assign( {
		package: 'Heisenberg',
		name: 'heisenberg',
		src: 'src/icons',
		dest: 'inc/icons.php',
		options: {
			plugins: [
				{ removeAttrs: {} },
				{ removeDimensions: true },
				{ removeEmptyAttrs: false },
				{ removeTitle: true },
				{ removeViewBox: false },
			],
		},
	}, customConfig );

	const svgo = new SVGO( config.options );
	const srcDir = paths.resolveApp( config.src );
	const files = fs.readdirSync( srcDir );
	const icons = files.filter( elm => elm.match(/.*\.(svg)/ig) );

	let content = '';

	eachAsync( icons, (fileName, i, next) => {
		const icon = fs.readFileSync( srcDir + '/' + fileName );

		svgo.optimize( icon ).then( optimizedSvg => {
			let fileContent = optimizedSvg.data;
			const name = fileName.split( '.' )[0];

			fileContent = fileContent.slice( 0, 4 ) +
						' class="\' . esc_attr( $classnames ) . \'" height="\' . esc_attr( $height ) . \'" width="\' . esc_attr( $width ) . \'"' +
						fileContent.slice( 4, -6 ) +
						fileContent.slice( -6 );

			content += `\n\t\t\tcase '${name}':\n\t\t\t\t$svg = '${fileContent}';\n\t\t\t\tbreak;\n`;

			next();
		});
	}, () => {
		let phpFile = '';
		phpFile = fs.readFileSync( path.resolve( __dirname, '../assets/icons/header.php' ), 'utf8' );
		phpFile += content;
		phpFile += fs.readFileSync( path.resolve( __dirname, '../assets/icons/footer.php' ), 'utf8' );

		// Replace with config vars.
		phpFile = phpFile.replace( /{{package}}/g, config.package ).replace( /{{name}}/g, config.name );

		fs.writeFile( paths.resolveApp( config.dest ), phpFile, err => {
			if ( err ) {
				throw err;
			}

			console.log( chalk.green( 'The icon file has been created!' ) );
		});
	});
}

// Find custom config and build
getConfig( 'icons' ).then( config => {
	build( config );
} );
