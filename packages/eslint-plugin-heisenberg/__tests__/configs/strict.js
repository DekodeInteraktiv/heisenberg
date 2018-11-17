/**
 * External dependencies
 */
const isPlainObj = require( 'is-plain-obj' );

/**
 * Internal dependencies
 */
const config = require( '../../lib/strict-mode' );

/**
 * Tests
 */
it( 'should be a valid config', () => {
	expect( isPlainObj( config ) ).toBe( true );
	expect( isPlainObj( config.rules ) ).toBe( true );
} );