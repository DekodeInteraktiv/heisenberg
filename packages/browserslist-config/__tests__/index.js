/**
 * External dependencies
 */
const _ = require( 'lodash' );
const browserslist = require( 'browserslist' );

/**
 * Internal dependencies
 */
const config = require( '../' );

/**
 * Tests
 */
it( 'should export an array', () => {
	expect( _.isArray( config ) ).toBe( true );
} );

it( 'should not contain invalid queries', () => {
	const result = browserslist( [ 'extends @dekode/browserslist-config-default' ] );
	expect( result ).toBeTruthy();
} );
