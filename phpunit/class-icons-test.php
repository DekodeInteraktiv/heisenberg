<?php
/**
 * Test icons function
 *
 * @package Heisenberg
 */

declare( strict_types=1 );

/**
 * Test icons function class.
 */
class Icons_Test extends WP_UnitTestCase {
	/**
	 * Check if functions exists
	 */
	public function test_functions_exists() {
		$this->assertTrue(
			function_exists( 'heisenberg_get_icon' ),
			'heisenberg_get_icon exists'
		);

		$this->assertTrue(
			function_exists( 'heisenberg_the_icon' ),
			'heisenberg_the_icon exists'
		);
	}

	/**
	 * Missing icon
	 */
	public function test_missing_icon() {
		$icon = 'heisenberg';

		$this->assertEquals( heisenberg_get_icon( $icon ),
			"Missing icon - {$icon}",
			'Return missing icon text'
		);
	}

	/**
	 * Classnames
	 */
	public function test_classnames() {
		$this->assertContains( 'class="icon"', heisenberg_get_icon( 'logo' ) );
		$this->assertContains( 'class="icon heisenberg"', heisenberg_get_icon( 'logo', [
			'classname' => 'heisenberg',
		] ) );
	}

	/**
	 * Size
	 */
	public function test_size() {
		// Default size.
		$default_size_icon = heisenberg_get_icon( 'logo' );
		$this->assertContains( 'height="24"', $default_size_icon, 'Has default height of 24' );
		$this->assertContains( 'width="24"', $default_size_icon, 'Has default width of 24' );

		// Custom size.
		$custom_size_icon = heisenberg_get_icon( 'logo', [ 'size' => 50 ] );
		$this->assertContains( 'height="50"', $custom_size_icon, 'Has custom size of 50 (height)' );
		$this->assertContains( 'width="50"', $custom_size_icon, 'Has custom size of 50 (width)' );

		// Custom height.
		$custom_height_icon = heisenberg_get_icon( 'logo', [ 'height' => 50 ] );
		$this->assertContains( 'height="50"', $custom_height_icon, 'Has custom height of 50' );
		$this->assertContains( 'width="24"', $custom_height_icon, 'Has default width of 24 when custom height is defined' );

		// Custom width.
		$custom_width_icon = heisenberg_get_icon( 'logo', [ 'width' => 50 ] );
		$this->assertContains( 'height="24"', $custom_width_icon, 'Has default height of 24 when custom width is defined' );
		$this->assertContains( 'width="50"', $custom_width_icon, 'Has custom width of 50' );

		// Custom height and width.
		$custom_height_width_icon = heisenberg_get_icon( 'logo', [
			'height' => 66,
			'width'  => 99,
		] );
		$this->assertContains( 'height="66"', $custom_height_width_icon, 'Has custom height of 66' );
		$this->assertContains( 'width="99"', $custom_height_width_icon, 'Has custom width of 99' );
	}
}
