import { match } from 'react-router';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import IsomorphicRouter from 'isomorphic-relay-router';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import Relay from 'react-relay';
import React from 'react';
import WithStylesContext from './components/WithStylesContext';
import Html from './lib/Html';
import Helmet from 'react-helmet';
import { schema } from './data/schema';
import routes from './routes';

const APP_PORT = 3000;
const app = express();

const GRAPHQL_URL = `http://localhost:${APP_PORT}/graphql`;

const networkLayer = new Relay.DefaultNetworkLayer(GRAPHQL_URL);

app.use(express.static(path.join(__dirname, 'public'), { index: false }));

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
      try {
        const css = [];

        const reactOutput = ReactDOMServer.renderToString(
          <WithStylesContext onInsertCss={styles => css.push(styles._getCss())}>
            {IsomorphicRouter.render(props)}
          </WithStylesContext>
        );

        let head = Helmet.rewind();
        res.status(200).send(ReactDOMServer.renderToString(
          <Html
            head={head}
            criticalCss={css.join('')}
            markup={reactOutput}
            preloadedData={data}
          />
        ));
      } catch (err) {
        console.log(err);
      }
    }
  });
});

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
