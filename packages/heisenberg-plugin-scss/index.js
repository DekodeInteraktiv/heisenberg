module.exports = ( config ) => {
	config.module.rules[ 0 ].oneOf[ 0 ].test = /\.(css|scss)$/;
	config.module.rules[ 0 ].oneOf[ 0 ].use.push( {
		loader: 'sass-loader',
	} );

	return config;
};
