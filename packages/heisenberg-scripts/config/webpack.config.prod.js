/**
 * External dependencies
 */
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const FixStyleOnlyEntriesPlugin = require( 'webpack-fix-style-only-entries' );

module.exports = {
	mode: 'production',

	output: {
		filename: '[name].min.js',
	},

	module: {
		rules: [{
			oneOf: [
				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						use: [{
							loader: 'css-loader',
							options: {
								sourceMap: false,
							},
						}],
					}),
				},
				{
					loader: 'file-loader',
					exclude: [ /\.(js|js)$/, /\.html$/, /\.json$/ ],
					options: {
						name: 'static/media/[name].[hash:8].[ext]',
					},
				},
			],
		}],
	},

	plugins: [
		new FixStyleOnlyEntriesPlugin( { silent: true } ),
		new ExtractTextPlugin( '[name].min.css' ),
	],
};
