/**
 * External dependencies
 */
const autoprefixer = require( 'autoprefixer' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const FixStyleOnlyEntriesPlugin = require( 'webpack-fix-style-only-entries' );
const postcssFlexbugsFixes = require( 'postcss-flexbugs-fixes' );
const cssnano = require( 'cssnano' );

/**
 * Internal dependencies
 */
const { getBabelOptions } = require( '../utils/get-babel-options' );

module.exports = ( filenames ) => ( {
	mode: 'production',

	output: {
		filename: filenames.output,
	},

	module: {
		rules: [{
			oneOf: [
				{
					test: /\.m?js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: getBabelOptions(),
					},
				},
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
										cssnano(),
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
						name: filenames.media,
					},
				},
			],
		}],
	},

	plugins: [
		new FixStyleOnlyEntriesPlugin( { silent: true } ),
		new ExtractTextPlugin( filenames.css ),
	],
} );
