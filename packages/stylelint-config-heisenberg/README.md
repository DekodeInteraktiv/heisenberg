# stylelint-config-heisenberg

> Heisenberg shareable config for stylelint.

## Installation

```bash
$ npm install stylelint-config-heisenberg --save-dev
```

## Usage

If you've installed `stylelint-config-heisenberg` locally within your project, just set your `stylelint` config to:

```json
{
  "extends": "stylelint-config-heisenberg"
}
```

## Extending the config

Simply add a `"rules"` key to your config and add your overrides there.

For example, to change the `indentation` to four spaces and turn off the `number-leading-zero` rule:


```json
{
  "extends": "stylelint-config-heisenberg",
  "rules": {
    "indentation": 4,
    "number-leading-zero": null
  }
}
```
