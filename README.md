# fetcho

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]


```js
import fetcho from 'fetcho';
// or const fetcho = require('fetcho');
fetcho('https://httpbin.org/get?test=foo')
	.then(console.log)
```

[npm-image]: https://img.shields.io/npm/v/fetcho.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/fetcho
[travis-image]: https://img.shields.io/travis/caub/fetcho.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/fetcho
[codecov-image]: https://img.shields.io/codecov/c/github/caub/fetcho.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/caub/fetcho
