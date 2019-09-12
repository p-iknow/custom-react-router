import React, { useContext } from 'react';
import { RouterContext } from './context';
import { matchPath } from './util'

export function Route({ path, exact=false, strict=false, sensitive=false, render, component : Component }) {
  const { route, history } = useContext(RouterContext);
  

  const match = matchPath(route.path, { path, exact, strict, sensitive })
  debugger;
  if (!match)
    return null

  if (Component)
    return <Component history={history} match={match} location={route} />

  if (render)
    return render({ match })

  return null
}
export default Route;