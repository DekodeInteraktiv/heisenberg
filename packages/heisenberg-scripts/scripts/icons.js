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
const getHeisenbergConfig = require( '../utils/config' );
const paths = require( '../utils/paths' );

function build( config ) {
	const svgo = new SVGO( config.options );
	const srcDir = paths.resolveRoot( config.src );
	const files = fs.readdirSync( srcDir );
	const icons = files.filter( elm => elm.match(/.*\.(svg)/ig) );

	let content = '';

	eachAsync( icons, (fileName, i, next) => {
		const icon = fs.readFileSync( `${ srcDir }/${ fileName }` );

		svgo.optimize( icon ).then( optimizedSvg => {
			let fileContent = optimizedSvg.data;
			const name = fileName.split( '.' )[0];

			/* eslint-disable */
			fileContent = fileContent.slice( 0, 4 ) +
						' class="\' . esc_attr( $classnames ) . \'" height="\' . esc_attr( $height ) . \'" width="\' . esc_attr( $width ) . \'"' +
						fileContent.slice( 4, -6 ) +
						fileContent.slice( -6 );
			/* eslint-enable */

			content += `\n\t\t\tcase '${ name }':\n\t\t\t\t$svg = '${ fileContent }';\n\t\t\t\tbreak;\n`;

			next();
		});
	}, () => {
		let phpFile = '';
		phpFile = fs.readFileSync( path.resolve( __dirname, '../assets/icons/header' ), 'utf8' );
		phpFile += content;
		phpFile += fs.readFileSync( path.resolve( __dirname, '../assets/icons/footer' ), 'utf8' );

		// Replace with config vars.
		phpFile = phpFile
			.replace( /{{package}}/g, config.package )
			.replace( /{{name}}/g, config.name )
			.replace( /{{getName}}/g, config.getName )
			.replace( /{{theName}}/g, config.theName );

		fs.writeFile( paths.resolveRoot( config.dest ), phpFile, err => {
			if ( err ) {
				throw err;
			}

			console.log( chalk.green( 'The icon file has been created!' ) );
		});
	});
}

// Find custom config and build
getHeisenbergConfig().then( config => {
	build( config.icons );
} );
