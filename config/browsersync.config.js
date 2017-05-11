/**
 * Internal dependencies
 */
const paths = require( './paths' );
const removeIfManifestFile = require( './utils/manifest-remove-file' );

/**
 * Config
 */
module.exports = ( port, devPort ) => {
	return {
		host: 'localhost',
		port,
		proxy: {
			target: require( paths.appPackageJson ).proxy,
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
			replace: ( req, res, match ) =>
				`<script type="text/javascript">var heisenbergDevPort = ${devPort};</script>\n` +
				`<script type="text/javascript" src="http://localhost:${devPort}/bundle.js"></script>\n${match}`,
		}],
		codeSync: false,
		timestamps: false,
		logLevel: 'silent',
	}
};
