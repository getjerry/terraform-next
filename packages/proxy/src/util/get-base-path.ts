export function getBasePath(uri: string) {
  if (!uri || uri === '/' || uri.match(/^\/_next/) || uri.match(/^\/[^\/]+\./)) return '';
  return uri.replace(/^(\/[^\/]+)(.*)/, '$1')
}
