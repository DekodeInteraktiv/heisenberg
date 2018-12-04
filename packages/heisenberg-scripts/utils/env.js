/**
 * External dependencies
 */
const dotenvExpand = require( 'dotenv-expand' );
const dotenv = require( 'dotenv' );

/**
 * Internal dependencies
 */
const { resolveRoot } = require( './paths' );

/**
 * Setup
 */
dotenvExpand( dotenv.config( { path: resolveRoot( '.env.local' ) } ) );
