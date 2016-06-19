import graphQLHTTP from 'express-graphql';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { schema } from './data/schema';
import App from './containers/App';

const APP_PORT = 3000;
const app = express();

app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.use('/graphql', graphQLHTTP({ schema, pretty: true, graphiql: true }));

app.get('*', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <link type='image/x-icon' rel='shortcut icon'>
      ${!__DEV__ ? '<link rel="stylesheet" type="text/css" href="static/styles.css">' : ''}
    </head>
    <body>
      <div id="root">${ReactDOMServer.renderToString(<App />)}</div>
      <script src="static/app.js"></script>
    </body>
    </html>
  `);
});

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
