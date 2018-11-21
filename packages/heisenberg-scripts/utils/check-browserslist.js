/**
 * External dependencies
 */
const browserslist = require( 'browserslist' );
const chalk = require( 'chalk' );

/**
 * Internal dependencies
 */
const { rootDirectory } = require( './paths' );

function checkBrowsers() {
	const current = browserslist.findConfig( rootDirectory );

	if ( current != null ) {
		return Promise.resolve( current );
	}

	return Promise.reject(
		new Error(
			chalk.red( 'You must specify targeted browsers.\n' )
		)
	);
}

module.exports = {
	checkBrowsers,
};
