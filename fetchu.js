export default (url, o = {}) => {
  if (typeof o.body === 'object') {
    o.headers = { ...o.headers, 'content-type': o.headers && o.headers['content-type'] || 'application/json' };
    o.body = JSON.stringify(o.body);
  }
  return fetch(url, o).then(r =>
    r.json().catch(() => r.text()).then(body => {
      if (r.ok) return body;
      throw new Error(typeof body === 'string' ? body : body.message || 'API error');
    })
  )
}
