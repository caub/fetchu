const http = require('http');
const https = require('https');
const { EventEmitter } = require('events');

const fetchu = (url, { body: _body, headers: _headers, signal, redirect, ...o } = {}) => new Promise((resolve, reject) => {
	let body = _body, headers = _headers;
	if (body && (Object.getPrototypeOf(body) === Object.prototype || Object.getPrototypeOf(body) === null)) { // if we pass a plain object as body, stringify and put the right content-type
		body = JSON.stringify(body);
		headers = { ...headers, 'content-type': 'application/json' };
	}
	const req = (/^https:/.test(o.protocol || url) ? https : http).request(url, { ...o, headers });
	req.once('error', reject);
	req.once('response', async res => {
		if (res.headers.location && redirect !== 'manual') {
			try {
				resolve(await fetchu(res.headers.location, { ...o, headers, body, signal, redirect }));
			} catch (error) {
				reject(error)
			}
			return;
		}
		const r = {
			status: res.statusCode,
			ok: res.statusCode < 400,
			body: res,
			headers: { get(name) { return res.headers[name.toLowerCase()]; } },
			async buffer() {
				const bufs = [];
				for await (const buf of res) bufs.push(buf);
				return Buffer.concat(bufs);
			},
			async text() { return await r.buffer() + ''; },
			async json() { return JSON.parse(await r.buffer()); },
		}
		if (r.ok) return resolve(r);

		const text = await r.text();
		let parsed;
		try {
			parsed = JSON.parse(text);
		} catch { }
		const err = new Error(parsed && parsed.message || parsed && parsed.error || text);
		err.status = r.status;
		reject(err);
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
