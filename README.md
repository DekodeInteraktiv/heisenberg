# Heisenberg 🦄
Heisenberg is a modern build setup, inspired by [Create react app](https://github.com/facebookincubator/create-react-app/).

Heisenberg works on macOS, Windows, and Linux.<br />
If something doesn’t work please [file an issue](https://github.com/DekodeInteraktiv/heisenberg/issues/new).

## Table of Contents
- [Available Scripts](#available-scripts)
  - [yarn start](#yarn-start)
  - [yarn test](#yarn-test)
  - [yarn build](#yarn-build)
- [Proxy](#proxy)
- [Editor style](#editor-style)
- [Using Global Variables](#using-global-variables)
- [Adding Flow](#adding-flow)
- [Running Tests](#running-tests)
  - [Filename Conventions](#filename-conventions)
  - [Command Line Interface](#command-line-interface)
  - [Version Control Integration](#version-control-integration)
  - [Initializing Test Environment](#initializing-test-environment)
  - [Focusing and Excluding Tests](#focusing-and-excluding-tests)
  - [Coverage Reporting](#coverage-reporting)
  - [Continuous Integration](#continuous-integration)
  - [Disabling jsdom](#disabling-jsdom)

## Available Scripts
In the project directory, you can run:

### `yarn start`
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

To run the development task it is required to define the `[proxy](#proxy)`
field in `package.json`.

### `yarn test`
Launches the test runner in the interactive watch mode.

### `yarn build`
Builds the app for production to the `dist` folder.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

## Proxy
The development mode is proxying an existing vhost. It will wrap your vhost
with a proxy URL to view your site.

To define the proxy add a `proxy` field to your `package.json`, for example:

```json
"proxy": "http://local-url.dev",
```

## Editor style
In WordPress you can create a separate TinyMCE editor style, but WordPress does
not need this front-end, so you don't want to add this to the entry key. To
create a editor file on `build` add this to your `package.json`:

```json
"editor": "./src/editor.scss",
```

## Using Global Variables
When you include a script in the HTML file that defines global variables and
try to use one of these variables in the code, the linter will complain because
it cannot see the definition of the variable.

You can avoid this by reading the global variable explicitly from the `window`
object, for example:

```js
const $ = window.$;
```

This makes it obvious you are using a global variable intentionally rather than
because of a typo.

Alternatively, you can force the linter to ignore any line by adding
`// eslint-disable-line` after it.

## Adding Flow
Flow is a static type checker that helps you write code with fewer bugs. Check
out this [introduction to using static types in JavaScript](https://medium.com/@preethikasireddy/why-use-static-types-in-javascript-part-1-8382da1e0adb) if you are new to this concept.

Recent versions of [Flow](http://flowtype.org/) work with Heisenberg projects
out of the box.

To add Flow to a Heisenberg project, follow these steps:

1. Run `yarn add --dev flow-bin`.
2. Add `"flow": "flow"` to the `scripts` section of your `package.json`.
3. Run `yarn flow -- init` to create a [`.flowconfig` file](https://flowtype.org/docs/advanced-configuration.html) in the root directory.
4. Add `// @flow` to any files you want to type check (for example, to `src/main.js`).

Now you can run `yarn flow` to check the files for type errors.

To learn more about Flow, check out [its documentation](https://flowtype.org/).

## Running Tests
Heisenberg uses [Jest](https://facebook.github.io/jest/) as its test runner.

Jest is a Node-based runner. This means that the tests always run in a Node environment and not in a real browser. This lets us enable fast iteration speed and prevent flakiness.

While Jest provides browser globals such as `window` thanks to [jsdom](https://github.com/tmpvar/jsdom), they are only approximations of the real browser behavior. Jest is intended to be used for unit tests of your logic and your components rather than the DOM quirks.

We recommend that you use a separate tool for browser end-to-end tests if you need them. They are beyond the scope of Heisenberg.

### Filename Conventions
Jest will look for test files with any of the following popular naming conventions:

* Files with `.js` suffix in `__tests__` folders.
* Files with `.test.js` suffix.
* Files with `.spec.js` suffix.

The `.test.js` / `.spec.js` files (or the `__tests__` folders) can be located at any depth under the `src` top level folder.

We recommend to put the test files (or `__tests__` folders) next to the code they are testing so that relative imports appear shorter. For example, if `App.test.js` and `App.js` are in the same folder, the test just needs to `import App from './App'` instead of a long relative path. Colocation also helps find tests more quickly in larger projects.

### Command Line Interface
When you run `yarn test`, Jest will launch in the watch mode. Every time you save a file, it will re-run the tests, just like `yarn start` recompiles the code.

The watcher includes an interactive command-line interface with the ability to run all tests, or focus on a search pattern. It is designed this way so that you can keep it open and enjoy fast re-runs. You can learn the commands from the “Watch Usage” note that the watcher prints after every run:

![Jest watch mode](http://facebook.github.io/jest/img/blog/15-watch.gif)

### Version Control Integration
By default, when you run `yarn test`, Jest will only run the tests related to files changed since the last commit. This is an optimization designed to make your tests runs fast regardless of how many tests you have. However it assumes that you don’t often commit the code that doesn’t pass the tests.

Jest will always explicitly mention that it only ran tests related to the files changed since the last commit. You can also press `a` in the watch mode to force Jest to run all tests.

Jest will always run all tests on a [continuous integration](#continuous-integration) server or if the project is not inside a Git repository.

### Initializing Test Environment
If your app uses a browser API that you need to mock in your tests or if you just need a global setup before running your tests, add a `src/setupTests.js` to your project. It will be automatically executed before running your tests.

For example:

#### `src/setupTests.js`
```js
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock
```

### Focusing and Excluding Tests
You can replace `it()` with `xit()` to temporarily exclude a test from being executed.<br>
Similarly, `fit()` lets you focus on a specific test without running any other tests.

### Coverage Reporting
Jest has an integrated coverage reporter that works well with ES6 and requires no configuration.<br>
Run `yarn test -- --coverage` (note extra `--` in the middle) to include a coverage report like this:

![coverage report](http://i.imgur.com/5bFhnTS.png)

Note that tests run much slower with coverage so it is recommended to run it separately from your normal workflow.

### Continuous Integration
By default `yarn test` runs the watcher with interactive CLI. However, you can force it to run tests once and finish the process by setting an environment variable called `CI`.

When creating a build of your application with `yarn build` linter warnings are not checked by default. Like `yarn test`, you can force the build to perform a linter warning check by setting the environment variable `CI`. If any warnings are encountered then the build fails.

Popular CI servers already set the environment variable `CI` by default but you can do this yourself too:

### Disabling jsdom
By default, the `package.json` of the generated project looks like this:

```js
  // ...
  "scripts": {
    // ...
    "test": "heisenberg-scripts test --env=jsdom"
  }
```

If you know that none of your tests depend on [jsdom](https://github.com/tmpvar/jsdom), you can safely remove `--env=jsdom`, and your tests will run faster.
