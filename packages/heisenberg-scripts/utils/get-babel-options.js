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
		presets: [ require.resolve( 'babel-preset-heisenberg' ) ],
	};
}

module.exports = {
	getBabelOptions,
};
