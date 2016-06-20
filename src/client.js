import { AppContainer } from 'react-hot-loader';
import IsomorphicRelay from 'isomorphic-relay';
import IsomorphicRouter from 'isomorphic-relay-router';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory, match, Router } from 'react-router';
import Relay from 'react-relay';
import routes from './routes';


const environment = new Relay.Environment();
environment.injectNetworkLayer(new Relay.DefaultNetworkLayer('/graphql'));
const data = JSON.parse(document.getElementById('preloadedData').textContent);
IsomorphicRelay.injectPreparedData(environment, data);

const rootEl = document.getElementById('root');

match({ routes, history: browserHistory }, (error, redirectLocation, renderProps) => {
  IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
    render(
      <AppContainer>
        <Router {...props} />
      </AppContainer>
      , rootEl
    );
  });
});

if (module.hot) {
  module.hot.accept('./routes', () => {
    const nextRoutes = require('./routes').default;

    match({ routes: nextRoutes, history: browserHistory }, (error, redirectLocation, renderProps) => {
      IsomorphicRouter.prepareInitialRender(environment, renderProps).then(props => {
        render(
          <AppContainer>
            <Router {...props} />
          </AppContainer>
          , rootEl
        );
      });
    });
  });
}
