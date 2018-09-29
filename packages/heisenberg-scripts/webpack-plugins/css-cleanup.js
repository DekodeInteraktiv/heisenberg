/**
 * Deletes all *.css.js files from the output directory after Webpack has
 * finished compiling.
 *
 * Webpack emits all bundles as JavaScript files - even CSS. To get a plain .css
 * file, we have to use * `extract-text-webpack-plugin` to yank the CSS out of
 * the .css.js file and write it to a .css file. This is done by
 * `createCssExtractorPlugin()`.
 *
 * However, we still end up with bunch of unneeded .css.js files in the output
 * directory, so this plugin deletes them.
 */

/**
* External dependencies
*/
const fs = require( 'fs-extra' );
const glob = require( 'glob' );

/**
* Internal dependencies
*/
const { resolveRoot } = require( '../utils/paths' );
const getHeisenbergConfig = require( '../utils/config' );


class CssCleanupPlugin {
	apply( compiler ) {
		compiler.hooks.done.tap( 'CssCleanupPlugin', () => this.deleteFiles() );
	}

	async deleteFiles() {
		const config = await getHeisenbergConfig();

		glob.sync( resolveRoot( `${ config.dest }/**/*.css.js*` ) ).forEach( ( absolutePath ) => {
			fs.removeSync( absolutePath );
		} );
	}
}

module.exports = CssCleanupPlugin;
