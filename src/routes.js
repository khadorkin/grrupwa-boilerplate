import React from 'react';
import { IndexRoute, Route } from 'react-router/es6';
import App from './containers/App';
import ViewerQueries from './queries/ViewerQueries';

function errorLoading(err) {
  console.error('Dynamic page loading failed', err);
}

function loadRoute(cb) {
  return module => cb(null, module.default);
}

export default (
  <Route path="/" component={App} queries={ViewerQueries}>
    <IndexRoute
      getComponent={(nextState, cb) =>
        System.import('./containers/PageA').then(loadRoute(cb)).catch(errorLoading)}
      queries={ViewerQueries}
    />
    <Route
      path="b"
      getComponent={(nextState, cb) =>
        System.import('./containers/PageB').then(loadRoute(cb)).catch(errorLoading)}
      queries={ViewerQueries}
    />
  </Route>
);
