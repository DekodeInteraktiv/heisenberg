'use strict';

/**
 * External dependencies
 */
const _ = require( 'lodash' );
const fs = require( 'fs' );
const paths = require( './paths' );

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[ require.resolve( './paths' ) ];

const NODE_ENV = process.env.NODE_ENV;
if ( ! NODE_ENV ) {
	throw new Error(
		'The NODE_ENV environment variable is required but was not specified.'
	);
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
var dotenvFiles = [
	`${paths.dotenv}.${NODE_ENV}.local`,
	`${paths.dotenv}.${NODE_ENV}`,
	// Don't include `.env.local` for `test` environment
	// since normally you expect tests to produce the same
	// results for everyone
	'test' !== NODE_ENV && `${paths.dotenv}.local`,
	paths.dotenv,
].filter( Boolean );

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
	if ( fs.existsSync( dotenvFile ) ) {
		require( 'dotenv-expand' )(
			require( 'dotenv' ).config( {
				path: dotenvFile,
			} )
		);
	}
});

// Grab NODE_ENV and HEISENBERG_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const HEISENBERG = /^HEISENBERG_/i;

/**
 * Get environment variables
 */
function getClientEnvironment() {
	const raw = Object.keys( process.env )
		.filter( key => HEISENBERG.test( key ) )
		.reduce(
			(env, key) => {
				env[key] = process.env[key];
				return env;
			},
			{
				// Useful for determining whether we’re running in production mode.
				NODE_ENV: process.env.NODE_ENV || 'development',
			}
		);

	// Stringify all values so we can feed into Webpack DefinePlugin
	const stringified = {
		'process.env': Object.keys( raw ).reduce( ( env, key ) => {
			env[ key ] = JSON.stringify( raw[ key ] );
			return env;
		}, {} ),
	};

	return stringified;
}

module.exports = getClientEnvironment;

/**
 * Get env proxy
 */
function getProxy() {
	return process.env.HEISENBERG_PROXY || _.trim( require( paths.appPackageJson ).proxy );
}
module.exports = getProxy;
