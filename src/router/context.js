import {createContext} from 'react';
import { createBrowserHistory } from 'history';
import { locationToRoute } from './util';

export const  history = createBrowserHistory();

export const RouterContext = createContext({
  route: locationToRoute(history.location),
  history
});
