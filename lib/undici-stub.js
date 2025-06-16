// Stub for undici to use native fetch in the browser
export const fetch = globalThis.fetch;
export const Headers = globalThis.Headers;
export const Request = globalThis.Request;
export const Response = globalThis.Response;

export default {
  fetch,
  Headers,
  Request,
  Response
};