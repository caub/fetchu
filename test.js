const { deepEqual: eq } = require('assert');
const fs = require('fs');
const fetchu = require('./fetchu-node.js');
const puppeteer = require('puppeteer');

(async () => {
	let browser, page;

	// test fetchu.mjs
	try {
		const r = await fetchu('http://httpbin.org/post', { method: 'POST', body: { ok: 3 } }).then(r => r.json());
		eq(JSON.parse(r.data), { ok: 3 });
		try {
			// wrong method
			await fetchu('http://httpbin.org/post', { method: 'PUT', body: { ok: 3 } }).then(r => r.json());
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
			content: `import fetchu from 'https://caub.github.io/fetchu/fetchu-browser.js';
		fetchu('https://cors-anywhere.herokuapp.com/http://example.com').then(r => r.text()).then(d => {
			window.__shortHtml = d.slice(0, 30);
		});
		`,
			type: 'module'
		});
		await page.waitForFunction('window.__shortHtml');
		eq(await page.evaluate(() => __shortHtml), `<!doctype html>\n<html>\n<head>\n`);
		console.log('ok');
	} catch (e) {
		console.error('ERR', e);
	}
	await page.close();
	await browser.close();
})()
	.catch(console.error);
