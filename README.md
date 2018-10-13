# fetchu: nodejs http-client

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

- fetchu.mjs: for NodeJS
- fetchu.js: for both node and browser, it relies on a global fetch

```js
import fetchu from 'https://unpkg.com/fetchu';

await fetchu('http://google.com') // <!doctype html><html ...
await fetchu('https://httpbin.org/get?test=foo') // { args: { test: 'foo' }, ...
await fetchu('https://httpbin.org/post', {method: 'POST', body: {test: 'foo'}}) // { args: {}, ..
```

NodeJS specificities:
```js
import fetchu from 'fetchu';
await fetchu({ path: '/v1.37/containers/json', socketPath: '/var/run/docker.sock' }) // [ { Id: 'aa6...
```

[npm-image]: https://img.shields.io/npm/v/fetchu.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/fetchu
[travis-image]: https://img.shields.io/travis/caub/fetchu.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/fetchu
