# Heisenberg
Heisenberg is a modern build setup, inspired by [Create react app](https://github.com/facebookincubator/create-react-app/).

Heisenberg works on macOS, Windows, and Linux.<br />
If something doesn’t work please [file an issue](https://github.com/DekodeInteraktiv/heisenberg/issues/new).

## Configuration
### Loading the configuration object
Finding and loading of your configuration object is done with [cosmiconfig](https://github.com/davidtheclark/cosmiconfig).
Starting from the current working directory, it will look for the following
possible sources, in this order:

-   a `heisenberg` property in `package.json`
-   a `.heisenbergrc` file
-   a `heisenberg.config.js` file exporting a JS object

The `.heisenbergrc` file (without extension) can be in JSON or YAML format.
Alternately, you can add a filename extension to designate JSON, YAML, or JS
format: `.heisenbergrc.json`, `.heisenbergrc.yaml`, `.heisenbergrc.yml`,
`.heisenbergrc.js`. You may want to use an extension so that your text editor
can better interpret the file, and help with syntax checking and highlighting.

Once one of these is found and parsed, the search will stop and that object will
be used.
