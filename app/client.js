import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById('root');
ReactDOM.render(
  <AppContainer>
    <div>Hello</div>
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./App', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    ReactDOM.render(
      <AppContainer>
        <div>Hello</div>
      </AppContainer>,
      rootEl
    );
  });
}
