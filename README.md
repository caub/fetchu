# fetcho: a useful fetch tiny wrapper 

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][codecov-image]][codecov-url]

#### Usage: like fetch, it prefills `headers` opts for convenience, and `body` is automatically JSON.stringified

```js
import fetcho from 'fetcho';
// or const fetcho = require('fetcho');

fetcho('https://httpbin.org/get?test=foo')
	.then(console.log)

fetcho('https://httpbin.org/post', {method: 'POST', body: {test: 'foo'}})
	.then(console.log)
```

#### How does it compare to axios? 

- it uses `window.fetch` in browser (polyfill it if needed, with polyfill.io for example), `node-fetch` + `fetch-cookie`
- Supports the Promise API: yes of course, like fetch
- Intercept request and response: no, just wrap it yourself
- Transform request and response data: no, same answer
- Cancel requests: use `AbortController` (polyfill.io might have it soon, or use the suggested polyfills https://github.com/Financial-Times/polyfill-service/issues/1722)
Automatic transforms for JSON data
- Client side support for protecting against XSRF: no

[npm-image]: https://img.shields.io/npm/v/fetcho.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/fetcho
[travis-image]: https://img.shields.io/travis/caub/fetcho.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/fetcho
[codecov-image]: https://img.shields.io/codecov/c/github/caub/fetcho.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/caub/fetcho
