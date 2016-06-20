import { match } from 'react-router';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import IsomorphicRouter from 'isomorphic-relay-router';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import Relay from 'react-relay';

import { schema } from './data/schema';
import routes from './routes';

const APP_PORT = 3000;
const app = express();

const GRAPHQL_URL = `http://localhost:${APP_PORT}/graphql`;

const networkLayer = new Relay.DefaultNetworkLayer(GRAPHQL_URL);

app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.use('/graphql', graphQLHTTP({ schema, pretty: true, graphiql: true }));

app.get('*', (req, res, next) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      next(error);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      IsomorphicRouter.prepareData(renderProps, networkLayer).then(render, next);
    } else {
      res.status(404).send('Not Found');
    }

    function render({ data, props }) {
      const reactOutput = ReactDOMServer.renderToString(IsomorphicRouter.render(props));
      res.send(`
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8">
          <link type='image/x-icon' rel='shortcut icon'>
          ${!__DEV__ ? '<link rel="stylesheet" type="text/css" href="static/styles.css">' : ''}
        </head>
        <body>
          <div id="root">${reactOutput}</div>
          <script id="preloadedData" type="application/json">
              <%- JSON.stringify(preloadedData).replace(/\//g, '\\/') %>
              ${JSON.stringify(data).replace(/\//g, '\\/')}
          </script>
          <script src="static/app.js"></script>
        </body>
        </html>
      `);
    }
  });
});

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
