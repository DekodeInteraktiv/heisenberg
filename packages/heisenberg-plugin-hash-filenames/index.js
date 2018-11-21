/**
 * External dependencies
 */
const { injectPlugin } = require( 'heisenberg-scripts' );
const ManifestPlugin = require( 'webpack-manifest-plugin' );

module.exports = ( config ) => {
	injectPlugin( config, new ManifestPlugin( {
		fileName: 'assets.json',
	} ) );

	return config;
};

module.exports.filenames = ( filenames ) => {
	filenames.css = '[name].[md5:contenthash:hex:8].min.css';
	filenames.media = 'static/[name].[hash:8].[ext]';
	filenames.output = '[name].[chunkhash:8].min.js';

	return filenames;
};
