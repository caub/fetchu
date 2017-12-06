const fetch = window.fetch;

export const fetchHeaders = (url, opts) => fetch(url, Object.assign({
	credentials: 'include',
	headers: {'Content-Type': 'application/json', Accept: '*/json'}
}, opts, opts && typeof opts.body === 'object' && {
	body: JSON.stringify(opts.body)
}));

export const toJson = r => (
	/^application\/json/.test(r.headers.get('Content-Type')) ? r.json() : r.text()
).then(body => r.ok ? body : Promise.reject(body));

/**
 * fetchJson helper
 * @param {*} url
 * @param {*} fetchOpts: optional
 */
export default (url, opts) => fetchHeaders(url, opts).then(toJson);
