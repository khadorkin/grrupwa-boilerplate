import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './containers/App';
import Page from './containers/Page';
import ViewerQueries from './queries/ViewerQueries';

export default (
  <Route
    path="/"
    component={App}
    queries={ViewerQueries}
  >
    <IndexRoute
      component={Page}
      queries={ViewerQueries}
    />
  </Route>
);
