import { IntlProvider } from 'react-intl';
import { match } from 'react-router';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressJwt from 'express-jwt';
import fs from 'fs';
import expressGraphQL from 'express-graphql';
import Helmet from 'react-helmet';
import IsomorphicRouter from 'isomorphic-relay-router';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Relay from 'react-relay';

import { auth, PORT, HOST, DATABASE_URL } from './config';
import { schema } from './data/schema';
import Html from './helpers/Html';
import passport from './data/passport';
import getRoutes from './routes';
import WithStylesContext from './helpers/WithStylesContext';

//
// Initialize and setup our app, database
// -----------------------------------------------------------------------------
const app = express();
mongoose.connect(DATABASE_URL);
const networkLayer = new Relay.DefaultNetworkLayer(`${HOST}/graphql`);

//
// Register Node middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Register Authentication middleware
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));

app.use(passport.initialize());

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
);
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  }
);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  graphiql: true,
  pretty: process.env.NODE_ENV !== 'production',
  rootValue: { request: req },
  schema,
})));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', (req, res, next) => {
  // Get JWT Token from cookie to authenticate user on entering a specific route
  const token = req.cookies.id_token;

  match({ routes: getRoutes(token), location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      next(error);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      IsomorphicRouter.prepareData(renderProps, networkLayer)
        .then(render, next); // eslint-disable-line no-use-before-define
    } else {
      res.status(404).send('Not Found');
    }
  });

  function render({ data, props }) {
    try {
      const css = [];

      const reactOutput = ReactDOMServer.renderToString(
        /* eslint-disable no-underscore-dangle */
        // Necessary for importing critical-css
        <WithStylesContext onInsertCss={styles => css.push(styles._getCss())}>
          <IntlProvider locale="en">
            {IsomorphicRouter.render(props)}
          </IntlProvider>
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
});

//
// Launch the server
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`App is now running on ${HOST}`);
});
