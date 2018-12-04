/**
 * Internal dependencies
 */
const { rootDirectory } = require('./paths' );
const getHeisenbergConfig = require( './config' );
const resolvePlugin = require( './resolve-plugin' );

const FILENAMES = {
	css: '[name].min.css',
	media: 'static/[name].[ext]',
	output: '[name].min.js',
};

async function getFilenames( names ) {
	const heisenbergConfig = await getHeisenbergConfig();

	heisenbergConfig.plugins.forEach( pluginName => {
		const { filenames } = require( resolvePlugin( pluginName, rootDirectory ) );

		if ( typeof filenames === 'function' ) {
			names = filenames( names, process.env.NODE_ENV );
		}
	} );

	return names;
}

module.exports = {
	getFilenames,
	FILENAMES,
};
