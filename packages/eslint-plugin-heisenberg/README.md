# eslint-plugin-heisenberg
A collection of custom ESLint rules that help enforce JavaScript coding standard in the Dekode project.

## Installation
You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install [`eslint-plugin-heisenberg`](https://github.com/DekodeInteraktiv/heisenberg/tree/master/packages/eslint-plugin-heisenberg):

```
$ npm install eslint-plugin-hesienberg --save-dev
```

## Usage
This plugin exports a [`recommended` config](index.js) that enforces best practices.

Create your own `.eslintrc.js` configuration file:

```js
{
	"extends": "plugin:heisenberg/recommended",
	"plugins": [
		"heisenberg"
	]
}
```

Or see the [ESLint docs](http://eslint.org/docs/user-guide/configuring.html#configuration-file-formats) for more information about configuration file formats.

You can also stack any of the extra shared configs on top of the "recommended" config by extending an array of linting configs. For example, this package provides a Node.js linting config, which can be added to the recommended config with the following configuration file:

```js
{
	"extends": [
		"plugin:heisenberg/recommended",
		"plugin:heisenberg/node"
	]
}
```

## Available rulesets
The following rulesets are available:

*   **jsdoc**: Requires valid JSDoc
*   **node**: Contains rules that are relevant in a Node.JS environment.
*   **recommended**: Enforces best practices and possible errors
