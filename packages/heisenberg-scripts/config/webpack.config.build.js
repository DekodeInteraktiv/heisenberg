'use strict';

/**
 * External dependencies
 */
const autoprefixer = require( 'autoprefixer' );
const chalk = require( 'chalk' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const fs = require( 'fs' );
const ManifestPlugin = require( 'webpack-manifest-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );
const webpack = require( 'webpack' );

/**
 * Internal dependencies
 */
const paths = require( './paths' );
const getClientEnvironment = require( './env' ).getClientEnvironment;

/**
 * Get client environment variables to inject into our build.
 */
const env = getClientEnvironment();

/**
 * Variables
 */
const argv = process.argv.slice( 2 );
const cacheBusting = 0 > argv.indexOf( '--no-filename-hashes' );
const watchFiles = -1 !== argv.indexOf( '--watch' );

// Assert this just to be safe.
if ( watchFiles && '"development"' !== env['process.env'].NODE_ENV ) {
	throw new Error( 'When watching builds you must have NODE_ENV=development.' );
} else if ( ! watchFiles && '"production"' !== env['process.env'].NODE_ENV ) {
	throw new Error( 'Production builds must have NODE_ENV=production.' );
}

/**
 * Entries
 */
const appPackage = require( paths.appPackageJson );
const entry = appPackage.entry;

if ( appPackage.editor ) {
	entry.editor = appPackage.editor;
}

/**
 * Config
 *
 * This is the development configuration.
 * It is focused on developer experience and fast rebuilds.
 * The production configuration is different and lives in a separate file.
 */
module.exports = ( options ) => {
	if ( ! cacheBusting ) {
		console.log( chalk.yellow( '--no-filename-hashes is deprecated. Please use heisenberg config instead.' ) );
		options.hashFilenames = false;
	}

	const config = {
		// Don't attempt to continue if there are any errors.
		bail: true,
		// These are the "entry points" to our application.
		entry,
		output: {
			// The build folder.
			path: paths.resolveApp( options.dest ),
			// Generated JS file names (with nested folders).
			// There will be one main bundle, and one file per asynchronous chunk.
			// We don't currently advertise code splitting but Webpack supports it.
			filename: options.hashFilenames ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
			chunkFilename: options.hashFilenames ? 'js/[name].[chunkhash:8].chunk.js' : 'js/[name].chunk.js',
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
								baseConfig: fs.existsSync( paths.appEslintConfig )
									? require( paths.appEslintConfig )
									: require( './eslint.config' ),
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
						'cache-loader',
						{
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env', '@babel/preset-flow'],
								plugins: ['@babel/plugin-proposal-object-rest-spread'],
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
									require( 'postcss-flexbugs-fixes' ),
									autoprefixer({
										flexbox: 'no-2009',
									}),
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
			// Stylelint
			new StyleLintPlugin({
				configFile: options.stylelintConfigFile,
				syntax: 'scss',
			}),
			// Makes some environment variables available to the JS code, for example:
			// if (process.env.NODE_ENV === 'production') { ... }.
			new webpack.DefinePlugin( env ),
			// Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
			new ExtractTextPlugin({
				filename: options.hashFilenames ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
				allChunks: true,
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

	if ( watchFiles ) {
		config.devtool = 'cheap-module-source-map';
	} else {
		config.plugins.push(
			// Minify the code.
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: {
						warnings: false,
					},
					output: {
						comments: false,
					},
				},
			})
		);
	}

	/**
	 * Generate a manifest file which contains a mapping of all asset filenames
	 * to their corresponding output file so that tools can pick it up.
	 */
	if ( options.manifest ) {
		config.plugins.push(
			new ManifestPlugin({
				fileName: 'assets.json',
			})
		);
	}

	if ( options.commonsChunkPlugin ) {
		config.plugins.push(
			new webpack.optimize.CommonsChunkPlugin( Object.assign( {
				name: 'commons',
				filename: options.hashFilenames ? 'js/commons.[chunkhash:8].js' : 'js/commons.js',
			}, options.commonsChunkPluginOptions ) )
		);
	}

	return config;
};
