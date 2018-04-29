/**
 * Skip link
 *
 * Helps with accessibility for keyboard only users.
 */
( function() {
	const isIe = /(trident|msie)/i.test( navigator.userAgent );

	if ( isIe && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			const id = location.hash.substring( 1 );

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			const element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
} )();
