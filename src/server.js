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
      const reactOutput = ReactDOMServer.renderToString(IsomorphicRouter.render(props));
      res.send(`
        <!doctype html>
        <html>
        <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta charset="utf-8">
          <title>GRRUPWA Boilerplate</title>

          <meta name="viewport" content="width=device-width, initial-scale=1">

          <link rel="manifest" href="manifest.json">
          <meta name="theme-color" content="#7acc9c">

          <link rel="shortcut icon" href=img/favicon.ico">
          <link rel="apple-touch-icon" sizes="57x57" href="img/apple-touch-icon-57x57.png">
          <link rel="apple-touch-icon" sizes="60x60" href="img/apple-touch-icon-60x60.png">
          <link rel="apple-touch-icon" sizes="72x72" href="img/apple-touch-icon-72x72.png">
          <link rel="apple-touch-icon" sizes="76x76" href="img/apple-touch-icon-76x76.png">
          <link rel="apple-touch-icon" sizes="114x114" href="img/apple-touch-icon-114x114.png">
          <link rel="apple-touch-icon" sizes="120x120" href="img/apple-touch-icon-120x120.png">
          <link rel="apple-touch-icon" sizes="144x144" href="img/apple-touch-icon-144x144.png">
          <link rel="apple-touch-icon" sizes="152x152" href="img/apple-touch-icon-152x152.png">
          <link rel="apple-touch-icon" sizes="180x180" href="img/apple-touch-icon-180x180.png">
          <link rel="icon" type="image/png" href="img/favicon-32x32.png" sizes="32x32">
          <link rel="icon" type="image/png" href="img/android-chrome-192x192.png" sizes="192x192">
          <link rel="icon" type="image/png" href="img/favicon-96x96.png" sizes="96x96">
          <link rel="icon" type="image/png" href="img/favicon-16x16.png" sizes="16x16">
          <link rel="manifest" href="img/manifest.json">
          <link rel="mask-icon" href="img/safari-pinned-tab.svg" color="#7acc9c">
          <meta name="msapplication-TileColor" content="#267F4B">
          <meta name="msapplication-TileImage" content=img/mstile-144x144.png">
          <meta name="theme-color" content="#7acc9c">
          <meta name="msapplication-config" content=img/browserconfig.xml">
        </head>
        <body>
          <div id="root">${reactOutput}</div>
          <script id="preloadedData" type="application/json">
              ${JSON.stringify(data).replace(/\//g, '\\/')}
          </script>
          <script src="js/app.js"></script>
          <script>
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('./service-worker.js', { scope: './' })
                .then(function(registration) {
                  registration.onupdatefound = function() {
                    if (navigator.serviceWorker.controller) {
                      var installingWorker = registration.installing;

                      installingWorker.onstatechange = function() {
                        switch (installingWorker.state) {
                          case 'installed':
                            console.log('Service Worker installed.');
                            break;
                          case 'redundant':
                            throw new Error('The installing ' +
                                            'service worker became redundant.');
                          default:
                            // Ignore
                        }
                      };
                    }
                  };
                }).catch(function(e) {
                  console.error('Error during service worker registration:', e);
                });
            } else {
              console.log('service worker is not supported');
            }
          </script>
        </body>
        </html>
      `);
    }
  });
});

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
