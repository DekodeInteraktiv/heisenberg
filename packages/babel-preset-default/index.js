module.exports = function( api ) {
	const isTestEnv = api.env() === 'test';

	return {
		presets: [
			! isTestEnv && [ '@babel/preset-env', {
				modules: false,
				useBuiltIns: 'usage',
			} ],
			isTestEnv && [ '@babel/preset-env', {
				useBuiltIns: 'usage',
			} ],
			'@babel/preset-flow',
		].filter( Boolean ),
		plugins: [
			'@babel/plugin-syntax-dynamic-import',
		].filter( Boolean ),
	};
};
