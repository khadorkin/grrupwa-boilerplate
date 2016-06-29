import { browserHistory, match, Router } from 'react-router/es6';
import { loadCSS } from 'fg-loadcss';
import { render } from 'react-dom';
import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRouter from 'isomorphic-relay-router';
import React from 'react';
import Relay from 'react-relay';

import getRoutes from './routes';
import WithStylesContext from './helpers/WithStylesContext';
import fetchWithRetries from '../node_modules/fbjs/lib/fetchWithRetries';

// Asynchronously load non-critical CSS.
// Components that have critical-css use withStyles decorator
if (!__DEV__) loadCSS('css/styles.css');

/*
 * This portion is important for Offline mode.
 * We convert the requests from POST to GET, to allow Service Workers to cache
 * responses for offline usage. Must be a function expression to keep "this" reference
*/
const environment = new Relay.Environment();
const DefaultNetworkLayer = new Relay.DefaultNetworkLayer('/graphql');
const rootEl = document.getElementById('root');

DefaultNetworkLayer._sendQuery = function modifiedSendQuery(request) {
  return fetchWithRetries(`/graphql?query=${request.getQueryString()}&variables=${JSON.stringify(request.getVariables())}`, {
    ...this._init,
    headers: {
      ...this._init.headers,
      Accept: '*/*',
    },
    method: 'GET',
  });
};

environment.injectNetworkLayer(DefaultNetworkLayer);
const data = JSON.parse(document.getElementById('preloadedData').textContent);
IsomorphicRelay.injectPreparedData(environment, data);


if (!__DEV__) {
  match({ routes: getRoutes(), history: browserHistory }, (error, redirectLocation, renderProps) => {
    IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
      render((
        <WithStylesContext onInsertCss={() => {}}>
          <Router {...props} />
        </WithStylesContext>
      ), rootEl);
    });
  });
} else if (__DEV__ && module.hot) {
  const { AppContainer } = require('react-hot-loader');
  match({ routes: getRoutes(), history: browserHistory }, (error, redirectLocation, renderProps) => {
    IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
      render((
        <AppContainer>
          <Router {...props} />
        </AppContainer>
      ), rootEl);
    });
  });

  module.hot.accept('./routes', () => {
    const getNextRoutes = require('./routes').default;

    // Displays react-router error on the browser. Might be required to replace with
    // React-transform to avoid seeing the error
    match({
      routes: getNextRoutes(),
      history: browserHistory,
    }, (error, redirectLocation, renderProps) => {
      IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
        render((
          <AppContainer>
            <Router {...props} />
          </AppContainer>
        ), rootEl);
      });
    });
  });
}
