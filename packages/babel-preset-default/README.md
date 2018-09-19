# Babel Preset Default
Default [Babel](https://babeljs.io/) preset for Dekode development.

### Usage
#### Via .babelrc (Recommended)
```json
{
  "presets": [ "@dekode/babel-preset-default" ]
}
```

#### Via CLI
```bash
babel script.js --presets @dekode/babel-preset-default
```

#### Via Node API
```js
require( '@babel/core' ).transform( 'code', {
  presets: [ '@dekode/babel-preset-default' ]
} );
```
