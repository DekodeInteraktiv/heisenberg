'use strict';

/**
 * External dependencies
 */
const autoprefixer = require( 'autoprefixer' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const ManifestPlugin = require( 'webpack-manifest-plugin' );

/**
 * Internal dependencies
 */
const paths = require( './paths' );

/**
 * Config
 *
 * This is the development configuration.
 * It is focused on developer experience and fast rebuilds.
 * The production configuration is different and lives in a separate file.
 */
module.exports = {
	// Don't attempt to continue if there are any errors.
	bail: true,
	// These are the "entry points" to our application.
	entry: require( paths.appPackageJson ).entry,
	output: {
		// The build folder.
		path: paths.appBuild,
		// Generated JS file names (with nested folders).
		// There will be one main bundle, and one file per asynchronous chunk.
		// We don't currently advertise code splitting but Webpack supports it.
		filename: 'js/[name].[chunkhash:8].js',
		chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
	},
	module: {
		rules: [
			// Disable require.ensure as it's not a standard language feature.
			{ parser: { requireEnsure: false } },
			// First, run the linter.
			// It's important to do this before Babel processes the JS.
			{
				test: /\.js$/,
				enforce: 'pre',
				use: [
					{
						// Point ESLint to our predefined config.
						options: {
							baseConfig: require( './eslint.config' ),
							useEslintrc: false,
						},
						loader: 'eslint-loader',
					},
				],
				include: paths.appSrc,
			},
			// ** ADDING/UPDATING LOADERS **
			// The "url" loader handles all assets unless explicitly excluded.
			// The `exclude` list *must* be updated with every change to loader extensions.
			// When adding a new loader, you must add its `test`
			// as a new entry in the `exclude` list in the "url" loader.

			// "file" loader makes sure those assets end up in the `build` folder.
			// When you `import` an asset, you get its filename.
			{
				exclude: [
					/\.js$/,
					/\.(scss|css)$/,
				],
				loader: 'file-loader',
				options: {
					name: 'static/[name].[hash:8].[ext]',
				},
			},
			// Process JS with Babel.
			{
				test: /\.js$/,
				use: [
					"cache-loader",
					{
						loader: 'babel-loader',
						options: {
							presets: ['env', 'babel-preset-flow'],
						},
					},
				],
			},
			// Process CSS with SaSS and autoprefixer
			{
				test: /\.(scss|css)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					publicPath: '../',
					use: [{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							minimize: true,
						},
					}, {
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								autoprefixer(),
							],
						},
					}, {
						loader: 'sass-loader',
					}],
				}),
			},
			// ** STOP ** Are you adding a new loader?
			// Remember to add the new extension(s) to the "url" loader exclusion list.
		],
	},
	plugins: [
		// Commons
		new webpack.optimize.CommonsChunkPlugin({
			name: 'commons',
			filename: 'js/commons.[chunkhash:8].js',
		}),
		// Makes some environment variables available to the JS code, for example:
		// if (process.env.NODE_ENV === 'development') { ... }.
		new webpack.DefinePlugin( JSON.stringify( process.env.NODE_ENV || 'production' ) ),
		// Minify the code.
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			output: {
				comments: false,
			},
		}),
		// Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
		new ExtractTextPlugin({
			filename: 'css/[name].[contenthash:8].css',
			allChunks: true,
		}),
		// Generate a manifest file which contains a mapping of all asset filenames
		// to their corresponding output file so that tools can pick it up without
		// having to parse `index.html`.
		new ManifestPlugin({
			fileName: 'assets.json',
		}),
	],
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
};
