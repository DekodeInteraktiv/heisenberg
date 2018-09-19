/**
 * External dependencies
 */
const isPlainObj = require( 'is-plain-obj' );

/**
 * Internal dependencies
 */
const config = require( '../../lib/recommended' );

/**
 * Tests
 */
it( 'should be a valid config', () => {
	expect( isPlainObj( config ) ).toBe( true );
	expect( isPlainObj( config.env ) ).toBe( true );
	expect( isPlainObj( config.rules ) ).toBe( true );
} );
