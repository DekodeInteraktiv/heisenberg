/**
 * External dependencies
 */
const findBabelConfig = require( 'find-babel-config' );

/**
 * Internal dependencies
 */
const { rootDirectory } = require( './paths' );

function getBabelOptions() {
	const { file } = findBabelConfig.sync( rootDirectory );

	if ( file ) {
		return {};
	}

	return {
		presets: [ 'heisenberg' ],
	};
}

module.exports = {
	getBabelOptions,
};
