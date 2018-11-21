module.exports = ( config ) => {
	config.module.rules[ 0 ].oneOf[ 1 ].test = /\.(css|scss)$/;
	config.module.rules[ 0 ].oneOf[ 1 ].use.push( {
		loader: 'sass-loader',
	} );
	config.module.rules[ 0 ].oneOf[ 1 ].use[ 2 ].options.importLoaders++;

	return config;
};
