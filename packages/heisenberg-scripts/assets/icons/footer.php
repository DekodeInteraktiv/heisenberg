		} // End switch.

		return $svg;
	}
}

if ( ! function_exists( '{{name}}_the_icon' ) ) {
	/**
	 * Prints SVG Icon
	 *
	 * @param string $icon Icon id.
	 * @param array  $args Arguments.
	 */
	function {{name}}_the_icon( string $icon, array $args = [] ) {
		echo {{name}}_get_icon( $icon, $args );
	}
}
