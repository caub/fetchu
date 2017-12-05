const nock = require('nock');
const assert = require('assert');
const fetcho = require('..');

nock('http://o.xo')
	.persist()
	.get('/test').reply(200, {ok: 1})
	.get('/foo').reply(200, {ok: 2})
	.post('/foo').reply(201, (uri, body) => body);

fetcho('http://o.xo/test')
	.then(data => assert.deepEqual(data, {ok: 1}));

fetcho('http://o.xo/foo')
	.then(data => assert.deepEqual(data, {ok: 2}));

fetcho('http://o.xo/404')
	.catch(err => assert(err));

fetcho('http://o.xo/foo', {method: 'POST', body: {ok: 3}})
	.then(data => assert.deepEqual(data, {ok: 3}));

fetcho('http://o.xo/foo', {method: 'POST', body: JSON.stringify({ok: 3})})
	.then(data => assert.deepEqual(data, {ok: 3}));
