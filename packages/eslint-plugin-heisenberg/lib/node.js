module.exports = {
	plugins: [ 'node' ],

	env: {
		node: true,
	},

	rules: require( './rules/node' ),
};
