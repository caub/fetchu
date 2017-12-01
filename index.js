import fetch from './fetch';

export const fetchHeaders = (url, {method = 'GET', body} = {}) => fetch(url, {
	method,
	body: body && JSON.stringify(body),
	credentials: 'include',
	headers: {'Content-Type': 'application/json', Accept: '*/json'}
});

export const toJson = r => (
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
export const fetchJson = (url, opts) => fetchHeaders(url, opts).then(toJson);

export default fetchJson;
