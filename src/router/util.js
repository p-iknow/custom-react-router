import qs from 'querystringify';
import pathToRegexp from "path-to-regexp";

export function locationToRoute(location) {
  // location comes from the history package
  return {
    path: location.pathname,
    hash: location.hash,
    query: qs.parse(location.search)
  };
}

function compilePath(path, options) {
  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  return result;
}

export function matchPath(pathname, options) {
  const { path, exact = false, stric = false, sensitive = false } = options;

  const paths = [].concat(path);
  return paths.reduce((matched, path) => {
    if (!path) return null;
    if (matched) return matched;

    const { regexp ,keys } = compilePath(path, {
      end: exact,
      stric,
      sensitive 
    });

    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;
  

    return {
      path,
      url: path === "/" && url === "" ? "/" : url,
      isExact,
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    }
  }, null)

}