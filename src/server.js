import { match } from 'react-router';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'fs';
import graphQLHTTP from 'express-graphql';
import Helmet from 'react-helmet';
import IsomorphicRouter from 'isomorphic-relay-router';
import mongoose from 'mongoose';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Relay from 'react-relay';

import { PORT, HOST, DATABASE_URL } from './config';
import { schema } from './data/schema';
import Html from './helpers/Html';
import routes from './routes';
import WithStylesContext from './helpers/WithStylesContext';

const app = express();
mongoose.connect(DATABASE_URL);
const networkLayer = new Relay.DefaultNetworkLayer(`${HOST}/graphql`);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', graphQLHTTP({ schema, pretty: true, graphiql: true }));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', (req, res, next) => {
  function render({ data, props }) {
    try {
      const css = [];

      const reactOutput = ReactDOMServer.renderToString(
        /* eslint-disable no-underscore-dangle */
        // Necessary for importing critical-css
        <WithStylesContext onInsertCss={styles => css.push(styles._getCss())}>
          {IsomorphicRouter.render(props)}
        </WithStylesContext>
      );

      let head = Helmet.rewind();
      const assets = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets.json')));

      res.status(200).send(ReactDOMServer.renderToString(
        <Html
          assets={assets}
          head={head}
          criticalCss={css.join('')}
          markup={reactOutput}
          preloadedData={data}
        />
      ));
    } catch (err) {
      res.status(500).send('Something went wrong.');
    }
  }

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
  });
});

//
// Launch the server
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App is now running on ${HOST}`);
});
