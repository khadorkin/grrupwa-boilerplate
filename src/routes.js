import React from 'react';
import { IndexRoute, Route } from 'react-router/es6';
import App from './containers/App';
import Page from './containers/Page';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Page} />
    <Route path=":category" component={Page} />
  </Route>
);
