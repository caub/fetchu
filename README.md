# fetcho

browser
```js
import fetcho from 'fetcho';
fetcho('https://httpbin.org/get?test=foo')
	.then(console.log)
```

node
```js
const fetcho = require('fetcho');
fetcho('https://httpbin.org/get?test=foo')
	.then(console.log)
```
