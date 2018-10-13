export default (url, o = {}) => {
  if (typeof o.body === 'object') {
    o.headers = { ...o.headers, 'content-type': o.headers && o.headers['content-type'] || 'application/json' };
    o.body = JSON.stringify(o.body);
  }
  return fetch(url, o).then(r =>
    (/^application\/json/.test(r.headers.get('content-type')) ? r.json() : r.text()).then(content => {
      if (r.ok) return content;
      throw new Error(typeof content === 'string' ? content : content.message || 'API error');
    })
  )
}
