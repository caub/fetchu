const { deepEqual: eq } = require('assert');
const fetchu = require('./fetchu-node.js');
const { EventEmitter } = require('events');
const delay = require('util').promisify(setTimeout);
require('abortcontroller-polyfill/dist/abortcontroller-polyfill-only');

(async () => {
	try {
		const r = await fetchu('http://httpbin.org/post', { method: 'POST', body: { ok: 3 } }).then(r => r.json());
		eq(JSON.parse(r.data), { ok: 3 });
		try {
			// wrong method
			await fetchu('http://httpbin.org/post', { method: 'PUT', body: { ok: 3 } }).then(r => r.json());
		} catch (e) {
			console.assert(e.message.includes('405')); // some shit html error message
		}

		const ac = new AbortController()
		const p = fetchu('https://httpbin.org/get?test=foo', { signal: ac.signal });
		delay(0).then(() => ac.abort());
		try {
			await p;
			console.assert(false, `shouldn't get there`);
		} catch (e) {
			console.assert(e.name === 'AbortError');
		}


		console.log('ok');
	} catch (e) {
		console.error('ERR', e);
	}
})()
	.catch(console.error);
