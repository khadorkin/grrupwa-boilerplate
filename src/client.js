import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import { browserHistory, Router } from 'react-router/es6';
import Relay from 'react-relay';
import routes from './routes';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { syncHistoryWithStore } from 'react-router-redux';
import createStore from './store';

const client = new ApolloClient();
const store = createStore();
const history = syncHistoryWithStore(browserHistory, store);
const rootEl = document.getElementById('root');

render(
  <AppContainer>
    <ApolloProvider store={store} client={client}>
      <Router history={history}>
        {routes}
      </Router>
    </ApolloProvider>
  </AppContainer>,
  rootEl
);


if (__DEV__ && module.hot) {
  module.hot.accept('./routes', () => {
    const nextRoutes = require('./routes').default;

    render(
      <AppContainer>
        <ApolloProvider store={store} client={client}>
          <Router history={browserHistory}>
            {nextRoutes}
          </Router>
        </ApolloProvider>
      </AppContainer>,
      rootEl
    );
  });
}
