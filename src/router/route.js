import React, { useContext } from 'react';
import { RouterContext } from './context';

export function Route({ path, component }) {

  const { route } = useContext(RouterContext);

  if ( route.path === path ) {
    return component;
  }

  return null;
  
}