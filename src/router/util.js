import qs from 'querystringify'
import { isNumericLiteral } from '@babel/types';

export function locationToRoute(location) {
  // location comes from the history package
  return {
    path: location.pathname,
    hash: location.hash,
    query: qs.parse(location.search)
  };
}

export function matchPath(pathname, options) {
  const { exact = false, path } = options;

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