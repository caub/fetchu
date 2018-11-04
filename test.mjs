import { deepEqual as eq } from 'assert';
import fs from 'fs';
import cp from 'child_process';
import fetchu from './fetchu.mjs';
import puppeteer from 'puppeteer';

(async () => {
	let browser, page;

	// test fetchu.mjs
	const r = await fetchu('http://httpbin.org/post', { method: 'POST', body: { ok: 3 } });
	eq(JSON.parse(r.data), { ok: 3 });

	try {
		// wrong method
		const r = await fetchu('http://httpbin.org/post', { method: 'PUT', body: { ok: 3 } });
	} catch (e) {
		console.assert(e.message.includes('405')); // some shit html error message
	}

	// test fetchu.js on browser
	const opts = !process.env.CI && fs.existsSync('/usr/bin/google-chrome') ? { executablePath: 'google-chrome' } : {};
	browser = await puppeteer.launch({ ...opts, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
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



	await page.close();
	await browser.close();

})()
