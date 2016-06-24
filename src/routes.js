import React from 'react';
import { IndexRoute, Route } from 'react-router/es6';
import App from './containers/App';
import ViewerQueries from './queries/ViewerQueries';
import PageA from './containers/PageA';
import PageB from './containers/PageB';

export default (
  <Route path="/" component={App} queries={ViewerQueries}>
    <IndexRoute component={PageA} queries={ViewerQueries} />
    <Route path="b" component={PageB} queries={ViewerQueries} />
  </Route>
);
