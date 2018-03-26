/**
 * Internal dependencies
 */
import { TAB, SPACE, LEFT, UP, RIGHT, DOWN } from './keycodes';

/**
 * Store
 */
let keyboardNavigation = false;

/**
 * Enable
 */
export function enable() {
	if ( keyboardNavigation ) {
		return;
	}

	keyboardNavigation = true;
	document.body.classList.add( 'accessible-focus' );
}

/**
 * Disable
 */
export function disable() {
	if ( ! keyboardNavigation ) {
		return;
	}

	keyboardNavigation = false;
	document.body.classList.remove( 'accessible-focus' );
}

/**
 * Boot
 */
export default () => {
	const keyCodes = [ TAB, SPACE, LEFT, UP, RIGHT, DOWN ];

	document.addEventListener( 'keydown', ( event ) => {
		if ( -1 !== keyCodes.indexOf( event.keyCode ) ) {
			enable();
		}
	});

	document.addEventListener( 'mouseup', () => {
		disable();
	});
};
