import React from 'react';
import { IndexRoute, Route } from 'react-router/es6';
import App from './containers/App';
import ViewerQueries from './queries/ViewerQueries';
import Page from './containers/Page';

function prepareItemListParams(params) {
  const mainCat = params.category ? params.category : 'any';
  return {
    ...params,
    category: mainCat,
  };
}
export default (
  <Route path="/" component={App} queries={ViewerQueries}>
    <IndexRoute
      component={Page}
      queries={ViewerQueries}
      prepareParams={prepareItemListParams}
      render={({ props, done, error, retry }) => (
        props ? <Page {...props} /> : <div>Loading</div>
      )}
    />
    <Route
      path=":category"
      component={Page}
      queries={ViewerQueries}
      prepareParams={prepareItemListParams}
      render={({ props, done, error, retry }) => (
        props ? <Page {...props} /> : <div>Loading</div>
      )}
    />
  </Route>
);
