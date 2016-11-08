# web-app-manifest-validator

Really simple [web app manifest](https://w3c.github.io/manifest/) validator.

## Install

```
$ npm install --save web-app-manifest-validator
```

## Usage

```js
var validator = require('web-app-manifest-validator');
var manifest = require('./manifest.json');

validator(manifest).forEach(function(error) {
  console.log(error);
});
```

## License

web-app-manifest-validator is licensed under the MIT license.

See [LICENSE](./LICENSE) for the full license text.
