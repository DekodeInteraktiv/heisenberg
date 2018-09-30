/**
 * Inject plugin into config
 */
function injectPlugin( config, plugin ) {
	config.plugins.push( plugin );
	return config;
}

module.exports = {
	injectPlugin,
};
