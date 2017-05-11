/**
 * Internal dependencies
 */
const paths = require( './paths' );
const removeIfManifestFile = require( './utils/manifest-remove-file' );

/**
 * Config
 */
module.exports = {
	host: 'localhost',
	port: 3000,
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
			`<script type="text/javascript" src="http://localhost:3100/bundle.js"></script>\n${match}`,
	}],
	codeSync: false,
	timestamps: false,
	logLevel: 'silent',
};
