import React from 'react';
import { IndexRoute, Route } from 'react-router/es6';

import App from './containers/App';
import ViewerQueries from './queries/ViewerQueries';
import Page from './containers/Page';
import ProtectedPage from './containers/ProtectedPage';

export default token => {
  function prepareItemListParams(params) {
    const mainCat = params.category ? params.category : 'any';
    return {
      ...params,
      category: mainCat,
    };
  }

  function requireAuth(nextState, replace, done) {
    if (!token) {
      replace({
        pathname: '/',
        state: { nextPathname: nextState.location.pathname },
      });
    }

    done();
  }

  return (
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
        path="/page/:category"
        component={Page}
        queries={ViewerQueries}
        prepareParams={prepareItemListParams}
        render={({ props, done, error, retry }) => (
          props ? <Page {...props} /> : <div>Loading</div>
      )}
      />
      <Route
        path="/protected"
        component={ProtectedPage}
        queries={ViewerQueries}
        render={({ props, done, error, retry }) => {
          return props ? <ProtectedPage {...props} /> : <div>Loading</div>;
        }}
        onEnter={requireAuth}
      />
    </Route>
  );
};
