const fetch = typeof window !== 'undefined' && window.fetch || require('fetch-cookie')(require('node-fetch'));

const fetchHeaders = (url, {method = 'GET', body} = {}) => fetch(url, {
	method,
	body: body && JSON.stringify(body),
	credentials: 'include',
	headers: {'Content-Type': 'application/json', Accept: '*/json'}
});

const toJson = r => (
	/^application\/json/.test(r.headers.get('Content-Type')) ? r.json() : r.text()
)
	.then(body => (
		r.ok ? body : Promise.reject(body)
	));

/**
 * fetchJson helper
 * @param {*} url
 * @param {*} opts: {method, body} optional
 */
const fetchJson = (url, opts) => fetchHeaders(url, opts).then(toJson);

module.exports = fetchJson;
module.exports.fetchHeaders = fetchHeaders;
module.exports.toJson = toJson;
module.exports['default'] = fetchJson;

Object.defineProperty(module.exports, '__esModule', { value: true });
