# fetchu: nodejs http-client

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

```js
await fetchu('http://google.com')

await fetchu('https://httpbin.org/get?test=foo')

await fetchu('https://httpbin.org/post', {method: 'POST', body: {test: 'foo'}})

await fetchu({ path: '/v1.37/containers/json', socketPath: '/var/run/docker.sock' })
```

[npm-image]: https://img.shields.io/npm/v/fetchu.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/fetchu
[travis-image]: https://img.shields.io/travis/caub/fetchu.svg?style=flat-square
[travis-url]: https://travis-ci.org/caub/fetchu
