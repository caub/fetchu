import http from 'http';
import https from 'https';

const fetchu = (url, o) => new Promise((resolve, reject) => {
	let body = o && o.body;
	if (typeof body === 'object') {
		o.headers = { ...o.headers, 'content-type': o.headers && o.headers['content-type'] || 'application/json' };
		body = JSON.stringify(body);
	}
	const req = (/^https:/.test(o && o.protocol || url) ? https : http).request(url, o);
	req.once('error', reject);
	req.once('response', async res => {
		if (res.headers.location) return resolve(await fetchu(res.headers.location, o || url));
		const bufs = [];
		for await (const buf of res) bufs.push(buf);
		const text = Buffer.concat(bufs);
		resolve(/^application\/json/.test(res.headers['content-type']) ? JSON.parse(text) : text + '');
	});
	if (body && typeof body.pipe === 'function') return body.pipe(req);
	if (body) {
		req.write(body);
	}
	req.end();
});

export default fetchu;
