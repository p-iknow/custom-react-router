import React, { useContext } from 'react';
import { RouterContext } from './context';

export function Route({ path, component : Component }) {

  const { route } = useContext(RouterContext);
  if ( route.path === path ) {

    return <Component />
  }

  return null;
  
}