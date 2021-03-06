module.exports = {
	proxy: 'http://twentynineteen.test',
	entry: {
		core: [
			'./packages/heisenberg-scripts/fixtures/kitchensink/src/index.js',
			'./packages/heisenberg-scripts/fixtures/kitchensink/src/style.css',
		],
		scss: './packages/heisenberg-plugin-scss/fixtures/kitchensink/src/style.scss',
	},
	plugins: [
		'scss',
		'unminified',
	],
	icons: {
		src: 'packages/heisenberg-scripts/fixtures/kitchensink/src/icons',
		dest: 'dist/icons.php',
	},
};
