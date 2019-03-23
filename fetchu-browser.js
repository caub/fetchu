export default (url, o = {}) => {
  if (typeof o.body === 'object' && !(o.body instanceof Blob)) { // if we pass a plain object as body (and not a Blob), stringify and put the right content-type
    o.headers = { ...o.headers, 'content-type': o.headers && o.headers['content-type'] || 'application/json' };
    o.body = JSON.stringify(o.body);
  }
  return fetch(url, o).then(async r => {
    if (r.ok) return r;
    const data = await (/^application\/json/.test(r.headers.get('content-type')) ? r.json() : r.text());
    throw new Error(typeof data === 'string' ? data : data && typeof data.message === 'string' ? data.message : JSON.stringify(data));
  });
}
