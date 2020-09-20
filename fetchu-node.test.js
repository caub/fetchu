const same = require('assert').deepStrictEqual;
const fetchu = require('./fetchu-node.js');
const nock = require('nock');
const delay = require('util').promisify(setTimeout);
require('abortcontroller-polyfill/dist/abortcontroller-polyfill-only');

(async () => {
	try {
		const r = await fetchu('http://httpbin.org/post', { method: 'POST', body: { ok: 3 } }).then(r => r.json());
		same(JSON.parse(r.data), { ok: 3 });
		try {
			// wrong method
			await fetchu('http://httpbin.org/post', { method: 'PUT', body: { ok: 3 } }).then(r => r.json());
		} catch (e) {
			console.assert(e.message.includes('405')); // some shit html error message
		}

		// Test abort controller
		const ac = new AbortController()
		const p = fetchu('https://httpbin.org/get?test=foo', { signal: ac.signal });
		delay(0).then(() => ac.abort());
		try {
			await p;
			console.assert(false, `shouldn't get there`);
		} catch (e) {
			console.assert(e.name === 'AbortError');
		}

		// Test redirection following
		nock('https://x.y')
			.get('/a')
			.times(2)
			.reply(307, null, { 'Location': 'https://x.y/b' })
			.get('/b')
			.reply(200, { ok: 1 });

		const r2 = await fetchu('https://x.y/a', { redirect: 'manual' });
		same(r2.status, 307);
		same(r2.headers.get('location'), 'https://x.y/b');

		const r3 = await fetchu('https://x.y/a');
		same(r3.status, 200);
		same(await r3.json(), { ok: 1 });

		console.log('ok');
	} catch (e) {
		console.error('ERR', e);
	}
})()
	.catch(console.error);
