export default (url, o = {}) => {
  if (typeof o.body === 'object') {
    o.headers = { ...o.headers, 'content-type': o.headers && o.headers['content-type'] || 'application/json' };
    o.body = JSON.stringify(o.body);
  }
  return fetch(url, o).then(async r => {
    if (r.ok) return r;
    const data = await (/^application\/json/.test(r.headers.get('content-type')) ? r.json() : r.text());
    throw new Error(data && data.message || data || 'API error');
  });
}
