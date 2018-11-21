# Babel Preset Default
Default [Babel](https://babeljs.io/) preset for Dekode development.

### Usage
#### Via .babelrc (Recommended)
```json
{
  "presets": [ "heisenberg" ]
}
```

#### Via CLI
```bash
babel script.js --presets babel-preset-heisenberg
```

#### Via Node API
```js
require( '@babel/core' ).transform( 'code', {
  presets: [ 'heisenberg' ]
} );
```
