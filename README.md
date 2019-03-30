# fetchu: universal http-client

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

- fetchu-node.js: using `http`/`https` modules for NodeJS, light drop-in replacement for `node-fetch`
- fetchu-browser.js: it wraps `window.fetch`

```js
import fetchu from 'https://unpkg.com/fetchu';

await fetchu('https://cors-anywhere.herokuapp.com/http://example.com').then(r => r.text()) // <!doctype html><html ...
await fetchu('https://httpbin.org/get?test=foo').then(r => r.json()) // { args: { test: 'foo' }, ...
await fetchu('https://httpbin.org/post', {method: 'POST', body: {test: 'foo'}}).then(r => r.json()) // { args: {},..

// abort:
const ac = new AbortController()
fetchu('https://httpbin.org/get?test=foo', { signal: ac.signal }).then(console.log, console.error)
delay(10).then(() => ac.abort())
```

NodeJS specificities (coming from http/https builtins):
```js
const fetchu = require('fetchu');
await fetchu({ path: '/v1.37/containers/json', socketPath: '/var/run/docker.sock' }).then(r => r.json()) // [ { Id: 'aa6...

// abort:
require('abortcontroller-polyfill/dist/abortcontroller-polyfill-only');
const ac = new AbortController()
fetchu('https://httpbin.org/get?test=foo', { signal: ac.signal }).then(console.log, console.error)
delay(10).then(() => ac.abort());
// or 
const signal = new EventEmitter(); // node.js native events.EventEmitter
fetchu('https://httpbin.org/get?test=foo', { signal }).then(console.log, console.error)
delay(10).then(() => signal.emit('abort'))
```

[npm-image]: https://img.shields.io/npm/v/fetchu.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/fetchu
[travis-image]: https://img.shields.io/travis/caub/fetchu.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/fetchu
