import { AppContainer } from 'react-hot-loader';
import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRouter from 'isomorphic-relay-router';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory, match, Router } from 'react-router/es6';
import Relay from 'react-relay';
import routes from './routes';
import { loadCSS } from 'fg-loadcss';
import fetchWithRetries from '../node_modules/fbjs/lib/fetchWithRetries';

// Asynchronously load non-critical CSS.
// Components that have critical-css use withStyles decorator
if (!__DEV__) loadCSS('css/styles.css');
const environment = new Relay.Environment();
const DefaultNetworkLayer = new Relay.DefaultNetworkLayer('/graphql');

/*
 * This portion is important for Offline mode.
 * We convert the requests from POST to GET, to allow Service Workers to cache
 * responses for offline usage. Must be a function expression to keep "this" reference
*/
DefaultNetworkLayer._sendQuery = function (request) {
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

const rootEl = document.getElementById('root');

match({ routes, history: browserHistory }, (error, redirectLocation, renderProps) => {
  IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
    render((
      <AppContainer>
        <Router {...props} />
      </AppContainer>
    ), rootEl);
  });
});

if (__DEV__ && module.hot) {
  module.hot.accept('./routes', () => {
    const nextRoutes = require('./routes').default;

    // Displays react-router error on the browser. Might be required to replace with
    // React-transform to avoid seeing the error
    match({
      routes: nextRoutes,
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
