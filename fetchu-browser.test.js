const same = require('assert').deepStrictEqual;
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    let browser = { close() { } }, page = { close() { } };

    try {
        const opts = !process.env.CI && fs.existsSync('/usr/bin/google-chrome') ? { executablePath: 'google-chrome' } : {};
        browser = await puppeteer.launch({ ...opts, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
        page = await browser.newPage();
        page.on('console', msg => console.log(msg.text()));
        page.on('error', err => console.error('error', err));
        page.on('pageerror', err => console.error('pageerror', err));

        const fetchuStr = (await fs.promises.readFile('./fetchu-browser.js', 'utf-8')).replace('export default fetchu;', '');
        const r2 = await page.evaluate(`${fetchuStr}
		fetchu('https://cors-anywhere.herokuapp.com/http://httpbin.org/post', {
			method: 'POST', 
			body: { lol: 1 }
		}).then(r => r.json())
		`);
        same(r2.data, '{"lol":1}');
        console.log('ok');
    } catch (e) {
        console.error('ERR', e);
    }
    await page.close();
    await browser.close();
})()
    .catch(console.error);
