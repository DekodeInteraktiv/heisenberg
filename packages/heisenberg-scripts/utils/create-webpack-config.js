/**
 * Internal dependencies
 */
const { rootDirectory } = require('./paths' );
const getHeisenbergConfig = require( './config' );
const resolvePlugin = require( './resolve-plugin' );

async function createWebpackConfig( config ) {
	const heisenbergConfig = await getHeisenbergConfig();

	config.entry = heisenbergConfig.entry;

	heisenbergConfig.plugins.forEach( name => {
		const plugin = require( resolvePlugin( name, rootDirectory ) );
		config = plugin( config, process.env.NODE_ENV );
	} );

	console.log( config );

	return config;
}

module.exports = createWebpackConfig;
