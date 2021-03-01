const fetchu = (url, { body, headers, ...o } = {}) => {
	return fetch(url, {
		body,
		headers,
		...body && (Object.getPrototypeOf(body) === Object.prototype || Object.getPrototypeOf(body) === null) && { // if we pass a plain object as body, stringify and put the right content-type
			body: JSON.stringify(body),
			headers: { ...headers, 'content-type': 'application/json' }
		},
		...o
	}).then(async r => {
		if (r.ok) return r;

		const text = await r.text();
		let parsed;
		try {
			parsed = JSON.parse(text);
		} catch { }
		const err = new Error(parsed && parsed.message || parsed && parsed.error || text);
		err.status = r.status;
		err.errors = parsed && parsed.errors;
		throw err;
	});
};

export default fetchu;
