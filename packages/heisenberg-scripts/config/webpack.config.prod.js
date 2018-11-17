/**
 * External dependencies
 */
const autoprefixer = require( 'autoprefixer' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const FixStyleOnlyEntriesPlugin = require( 'webpack-fix-style-only-entries' );
const postcssFlexbugsFixes = require( 'postcss-flexbugs-fixes' );

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
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									importLoaders: 1,
									sourceMap: false,
								},
							},
							{
								loader: 'postcss-loader',
								options: {
									plugins: [
										postcssFlexbugsFixes,
										autoprefixer({
											flexbox: 'no-2009',
										}),
									],
								},
							},
						],
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
