'use strict';

/**
 * External dependencies
 */
const autoprefixer = require( 'autoprefixer' );
const CaseSensitivePathsPlugin = require( 'case-sensitive-paths-webpack-plugin' );
const webpack = require( 'webpack' );
const WatchMissingNodeModulesPlugin = require( 'react-dev-utils/WatchMissingNodeModulesPlugin' );

/**
 * Internal dependencies
 */
const paths = require( './paths' );

/**
 * Entries
 */
const entry = [require.resolve( './utils/webpackHotDevClient' )];
const appEntry = require( paths.appPackageJson ).entry;

function addEntryFile( file ) {
	if ( '.' === file.charAt( 0 ) ) {
		entry.push( paths.resolveApp( file ) );
	} else {
		entry.push( file );
	}
}

Object.keys( appEntry ).forEach( key => {
	if ( Array.isArray( appEntry[key] ) ) {
		appEntry[key].forEach( value => {
			addEntryFile( value );
		});
	} else {
		addEntryFile( appEntry[key] );
	}
});

/**
 * Config
 *
 * This is the development configuration.
 * It is focused on developer experience and fast rebuilds.
 * The production configuration is different and lives in a separate file.
 */
module.exports = {
	devtool: 'cheap-module-source-map',
	// These are the "entry points" to our application.
	// This means they will be the "root" imports that are included in JS bundle.
	// The first two entry points enable "hot" CSS and auto-refreshes for JS.
	entry,
	output: {
		// Add /* filename */ comments to generated require()s in the output.
		pathinfo: true,
		// This does not produce a real file. It's just the virtual path that is
		// served by WebpackDevServer in development. This is the JS bundle
		// containing code from all our entry points, and the Webpack runtime.
		filename: 'bundle.js',
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
			// as a new entry in the `exclude` list for "url" loader.

			// "file" loader makes sure those assets get served by WebpackDevServer.
			// When you `import` an asset, you get its (virtual) filename.
			// In production, they would get copied to the `build` folder.
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
			{
				test: /\.js$/,
				use: [
					'cache-loader',
					{
						loader: 'babel-loader',
						options: {
							presets: ['env', 'babel-preset-flow'],
							// This is a feature of `babel-loader` for webpack (not Babel itself).
							// It enables caching results in ./node_modules/.cache/babel-loader/
							// directory for faster rebuilds.
							cacheDirectory: true,
						},
					},
				],
			},
			{
				test: /\.(scss|css)$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2,
							sourceMap: true,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								autoprefixer(),
							],
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			// ** STOP ** Are you adding a new loader?
			// Remember to add the new extension(s) to the "url" loader exclusion list.
		],
	},
	plugins: [
		// Makes some environment variables available to the JS code, for example:
		// if (process.env.NODE_ENV === 'development') { ... }.
		new webpack.DefinePlugin( JSON.stringify( process.env.NODE_ENV || 'development' ) ),
		// This is necessary to emit hot updates (currently CSS only):
		new webpack.HotModuleReplacementPlugin(),
		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		new CaseSensitivePathsPlugin(),
		// If you require a missing module and then `npm install` it, you still have
		// to restart the development server for Webpack to discover it. This plugin
		// makes the discovery automatic so you don't have to restart.
		new WatchMissingNodeModulesPlugin( paths.appNodeModules ),
	],
	// Some libraries import Node modules but don't use them in the browser.
	// Tell Webpack to provide empty mocks for them so importing them works.
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
	// Turn off performance hints during development because we don't do any
	// splitting or minification in interest of speed. These warnings become
	// cumbersome.
	performance: {
		hints: false,
	},
};
