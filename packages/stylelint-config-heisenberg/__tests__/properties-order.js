'use strict';

/**
 * External dependencies
 */
const fs = require( 'fs' );
const stylelint = require( 'stylelint' );

/**
 * Internal dependencies
 */
const config = require( '../' );
const validCss = fs.readFileSync( './__tests__/properties-order-valid.css', 'utf-8' );
const invalidCss = fs.readFileSync( './__tests__/properties-order-invalid.css', 'utf-8' );

/**
 * Tests
 */
describe( 'flags no warnings with valid properties order css', () => {
	let result;

	beforeEach(() => {
		result = stylelint.lint({
			code: validCss,
			config,
		});
	});

	it( 'did not error', () => {
		return result.then(data => (
			expect( data.errored ).toBeFalsy()
		));
	});

	it( 'flags no warnings', () => {
		return result.then(data => (
			expect( data.results[0].warnings ).toHaveLength( 0 )
		));
	});
});

describe( 'flags warnings with invalid properties order css', () => {
	let result;

	beforeEach(() => {
		result = stylelint.lint({
			code: invalidCss,
			config,
		});
	});

	it( 'did error', () => {
		return result.then(data => (
			expect( data.errored ).toBeTruthy()
		));
	});

	it( 'flags three warnings', () => {
		return result.then(data => (
			expect( data.results[0].warnings ).toHaveLength( 3 )
		));
	});
});
