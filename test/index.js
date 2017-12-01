const nock = require('nock');
const assert = require('assert');
const fetcho = require('..');

nock('http://o.xo')
	.get('/test')
	.reply(200, {ok: 1})

fetcho('http://o.xo/test')
	.then(data => assert.deepEqual(data, {ok: 1}));

fetcho('http://o.xo/404')
	.catch(err => assert(err));
