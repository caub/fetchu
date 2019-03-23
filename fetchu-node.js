const http = require('http');
const https = require('https');
const { EventEmitter } = require('events');

const fetchu = (url, o) => new Promise((resolve, reject) => {
	let body = o && o.body;
	if (typeof body === 'object' && typeof body.pipe !== 'function') { // if we pass a plain object as body (and not a stream), stringify and put the right content-type
		o.headers = { ...o.headers, 'content-type': o.headers && o.headers['content-type'] || 'application/json' };
		body = JSON.stringify(body);
	}
	const req = (/^https:/.test(o && o.protocol || url) ? https : http).request(url, o);
	req.once('error', reject);
	req.once('response', async res => {
		if (res.headers.location) return resolve(await fetchu(res.headers.location, o));
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
	if (o && o.signal) {
		const abort = () => {
			req.abort();
			const abortError = new Error('Aborted');
			abortError.name = 'AbortError';
			reject(abortError);
		}

		if (o.signal.aborted) return abort();
		o.signal[o.signal instanceof EventEmitter ? 'once' : 'addEventListener']('abort', abort, { once: true });
	}
	if (body && typeof body.pipe === 'function') return body.pipe(req);
	if (body) {
		req.write(body);
	}
	req.end();
});

module.exports = fetchu;
