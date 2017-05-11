'use strict';

/**
 * External dependencies
 */
var SockJS = require( 'sockjs-client' );

/**
 * Connect to WebpackDevServer via a socket.
 */
var connection = new SockJS( 'http://localhost:' + window.heisenbergDevPort + '/sockjs-node' );

// Unlike WebpackDevServer client, we won't try to reconnect
// to avoid spamming the console. Disconnect usually happens
// when developer stops the server.
connection.onclose = function() {
	console.info(
		'The development server has disconnected.\nRefresh the page if necessary.'
	);
};

/**
 * Variables
 */
var mostRecentCompilationHash = null;
var isFirstCompilation = true;

/**
 * Functions
 */
// There is a newer version of the code available.
function handleAvailableHash( hash ) {
	// Update last known compilation hash.
	mostRecentCompilationHash = hash;
}

// Successful compilation.
function handleSuccess() {
	var isHotUpdate = ! isFirstCompilation;
	isFirstCompilation = false;

	// Attempt to apply hot updates or reload.
	if ( isHotUpdate ) {
		tryApplyUpdates();
	}
}

// Is there a newer version of this code available?
function isUpdateAvailable() {
	/* globals __webpack_hash__ */
	// __webpack_hash__ is the hash of the current compilation.
	// It's a global variable injected by Webpack.
	return mostRecentCompilationHash !== __webpack_hash__;
}

// Webpack disallows updates in other states.
function canApplyUpdates() {
	return module.hot.status() === 'idle';
}

// Attempt to update code on the fly, fall back to a hard reload.
function tryApplyUpdates() {
	if ( ! isUpdateAvailable() || ! canApplyUpdates() ) {
		return;
	}

	function handleApplyUpdates( err, updatedModules ) {
		if ( err || ! updatedModules ) {
			window.location.reload();
			return;
		}

		if ( isUpdateAvailable() ) {
			// While we were updating, there was a new update! Do it again.
			tryApplyUpdates();
		}
	}

	// https://webpack.github.io/docs/hot-module-replacement.html#check
	var result = module.hot.check( true, handleApplyUpdates );

	if ( result && result.then ) {
		result.then(
			function( updatedModules ) {
				handleApplyUpdates( null, updatedModules );
			},
			function( err ) {
				handleApplyUpdates( err, null );
			}
		);
	}
}

/**
 * Handle messages from the server.
 */
connection.onmessage = function(e) {
	var message = JSON.parse(e.data);

	switch ( message.type ) {
		case 'hash':
			handleAvailableHash( message.data );
			break;
		case 'still-ok':
		case 'ok':
			handleSuccess();
			break;
		case 'content-changed':
			// Triggered when a file from `contentBase` changed.
			window.location.reload();
			break;
		default:
			// Do nothing.
	}
};
