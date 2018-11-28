export function addQueryToUrl(url, query) {
  if (url && query) {
    return `${url}?${query}`;
  }
  return url;
}

export function isThisIsBrowser() {
  return typeof window !== 'undefined';
}
