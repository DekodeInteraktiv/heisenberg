/**
 * Internal dependencies
 */
const getProxy = require( './env' ).getProxy;
const removeIfManifestFile = require( './utils/manifest-remove-file' );

/**
 * Config
 */
module.exports = ( port, devPort ) => {
	return {
		host: 'localhost',
		port,
		proxy: {
			target: getProxy(),
		},
		rewriteRules: [{
			// Remove all manifest js files
			match: /<script.*src=(?:['"])(.*)(?:['"]).*><\/script>/gi,
			fn: removeIfManifestFile,
		}, {
			// Remove all manifest css files
			match: /<link.*href=(?:['"])(.*)(?:['"]).*>/gi,
			replace: removeIfManifestFile,
		}, {
			// Append bundle
			match: /<\/body>/i,
			replace: ( req, res, match ) => {
				const publicPath = `http://${req.headers.host.split( ':' )[0]}:${devPort}/`;

				return '<script type="text/javascript">\n' +
						`var heisenbergDevUrl = '${publicPath}';\n` +
					'</script>\n' +
					`<script type="text/javascript" src="${publicPath}bundle.js"></script>\n${match}`;
			},
		}],
		codeSync: false,
		timestamps: false,
		logLevel: 'silent',
		open: false,
		notify: {
			styles: {
				backgroundColor: '#000',
				borderBottomLeftRadius: 0,
				bottom: 0,
				fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
				fontSize: '14px',
				fontWeight: 400,
				left: 0,
				padding: '5px',
				right: 'auto',
				top: 'auto',
			},
		},
	};
};
