export default class FetchError extends Error {
  constructor(body) {
    const message = typeof body === 'string' ? body : body.message || 'API error';
    super(message);
  }
}
