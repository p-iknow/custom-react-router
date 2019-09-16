import React, { useState, useEffect } from 'react';
import { locationToRoute } from './util';
import { history, RouterContext } from './context';
import { Route } from './Route';
import { Link } from './Link';

function Router(props) {
  const [route, setRoute] = useState(locationToRoute(history.location));

  const handleRouterChange = location => {
    const route = locationToRoute(location);
    setRoute(route);
  };

  useEffect(() => {
    const unlisten = history.listen(handleRouterChange);
    return () => {
      unlisten();
    };
  }, []);

  const { children } = props;
  const routerContextValue = { route, history };
  // const is404 = routes.indexOf(route.path) === -1;
  return (
    <RouterContext.Provider value={routerContextValue}>
      {children}
    </RouterContext.Provider>
  );
}

export { history, RouterContext, Router, Route, Link };
