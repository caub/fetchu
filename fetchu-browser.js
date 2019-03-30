const fetchu = (url, { body, headers, ...o }) => {
	return fetch(url, {
		body,
		headers,
		...body && Object.getPrototypeOf(body) === Object.prototype && { // if we pass a plain object as body, stringify and put the right content-type
			body: JSON.stringify(body),
			headers: { ...headers, 'content-type': 'application/json' }
		},
		...o
	}).then(async r => {
		if (r.ok) return r;
		const data = await (/^application\/json/.test(r.headers.get('content-type')) ? r.json() : r.text());
		throw new Error(typeof data === 'string' ? data : data && typeof data.message === 'string' ? data.message : JSON.stringify(data));
	});
};

export default fetchu;
