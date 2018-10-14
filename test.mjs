import { deepEqual as eq } from 'assert';
import fetchu from './fetchu.mjs';
import puppeteer from 'puppeteer';

(async () => {
	let browser, page;
	try {
		// test fetchu.mjs
		const r = await fetchu('http://httpbin.org/post', { method: 'POST', body: { ok: 3 } });
		eq(JSON.parse(r.data), { ok: 3 });

		// test fetchu.js on browser
		browser = await puppeteer.launch({ args: ['--no-sandbox'] });
		page = await browser.newPage();
		page.on('console', msg => console.log(msg.text()));
		page.on('error', err => console.error('error', err));
		page.on('pageerror', err => console.error('pageerror', err));
		await page.addScriptTag({
			content: `import fetchu from 'https://unpkg.com/fetchu';
fetchu('https://cors-anywhere.herokuapp.com/http://example.com').then(d => {
	window.__shortHtml = d.slice(0, 30);
});
`,
			type: 'module'
		});
		await page.waitForFunction('window.__shortHtml');
		eq(await page.evaluate(() => __shortHtml), `<!doctype html>
<html>
<head>
`);
		console.log('ok');

	} catch (e) {
		console.error(e)
	}

	await page.close();
	await browser.close();

})()
