import React, {createContext} from 'react';
import { createBrowseHistory } from 'history';
import { locationToRoute } from './util';

export const  history = createBrowseHistory();

export const RouterContext = createContext({
  route: locationToRoute(history.location)
});