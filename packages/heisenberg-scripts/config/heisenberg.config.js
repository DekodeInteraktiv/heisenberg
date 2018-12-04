module.exports = {
	dest: 'dist',
	entry: {},
	plugins: [],
	icons: {
		package: 'Heisenberg',
		name: 'heisenberg',
		src: 'src/icons',
		dest: 'inc/icons.php',
		getName: 'get_icon',
		theName: 'the_icon',
		options: {
			plugins: [
				{ removeAttrs: {} },
				{ removeDimensions: true },
				{ removeEmptyAttrs: false },
				{ removeTitle: true },
				{ removeViewBox: false },
			],
		},
	},
};
