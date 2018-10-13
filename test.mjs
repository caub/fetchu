import { deepEqual as eq } from 'assert';
import fetchu from './fetchu.mjs';

(async () => {
	const r = await fetchu('http://httpbin.org/post', { method: 'POST', body: { ok: 3 } });
	eq(JSON.parse(r.data), { ok: 3 });
	console.log('ok');
})()
	.catch(console.error)
