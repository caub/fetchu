const http = require('http');
const https = require('https');
const { EventEmitter } = require('events');

const fetchu = (url, { body: _body, signal, redirect, ...o }) => new Promise((resolve, reject) => {
	let body = _body;
	if (body && Object.getPrototypeOf(body) === Object.prototype) { // if we pass a plain object as body, stringify and put the right content-type
		body = JSON.stringify(body);
		o.headers = { ...o.headers, 'content-type': 'application/json' };
	}
	const req = (/^https:/.test(o.protocol || url) ? https : http).request(url, o);
	req.once('error', reject);
	req.once('response', async res => {
		if (res.headers.location && redirect !== 'manual') return resolve(await fetchu(res.headers.location, o));
		const getData = async () => {
			const bufs = [];
			for await (const buf of res) bufs.push(buf);
			return Buffer.concat(bufs);
		};
		const r = {
			ok: res.statusCode < 300,
			body: res,
			headers: { get(name) { return res.headers[name.toLowerCase()] } },
			async text() { return (await getData()) + ''; },
			async json() { return JSON.parse(await getData()); },
		}
		if (r.ok) return resolve(r);
		const data = await (/^application\/json/.test(r.headers.get('content-type')) ? r.json() : r.text());
		reject(new Error(typeof data === 'string' ? data : data && typeof data.message === 'string' ? data.message : JSON.stringify(data)));
	});
	if (signal) {
		const abort = () => {
			req.abort();
			const abortError = new Error('Aborted');
			abortError.name = 'AbortError';
			reject(abortError);
		}

		if (signal.aborted) return abort();
		signal[signal instanceof EventEmitter ? 'once' : 'addEventListener']('abort', abort, { once: true });
	}
	if (body && typeof body.pipe === 'function') return body.pipe(req);
	if (body) {
		req.write(body);
	}
	req.end();
});

module.exports = fetchu;
