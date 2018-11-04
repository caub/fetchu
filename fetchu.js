export default (url, o = {}) => {
  if (typeof o.body === 'object') {
    o.headers = { ...o.headers, 'content-type': o.headers && o.headers['content-type'] || 'application/json' };
    o.body = JSON.stringify(o.body);
  }
  return fetch(url, o).then(r =>
    (/^application\/json/.test(r.headers.get('content-type')) ? r.json() : r.text()).then(data => {
      if (r.ok) return data;
      throw new Error(typeof data === 'string' ? data : data.message || data || 'API error');
    })
  )
}
