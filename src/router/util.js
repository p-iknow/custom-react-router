import qs from 'querystringify';
import pathToRegexp from 'path-to-regexp';

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
  })

  if (!path) {
    return {
      path: null,
      url: pathname,
      isExact: true
    }
  }

  const match = new RegExp(`^${path}`).exec(pathname);

  if (!match) {
    // 메치된 내용이 없을 경우
    return null;
  }

  const url = match[0];
  const isExact = pathname === url;

  if (exact && !isExact) {
    // exact 옵션이 true 인데,
    // 정확하게 일치하지 않는 경우 
    return null;
  }

  return {
    path,
    url,
    isExact
  }
}