import graphQLHTTP from 'express-graphql';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { schema } from './data/schema';
import webpack from 'webpack';
import config from '../tools/webpack.config.js';
import App from './containers/App';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const APP_PORT = 3000;
const app = express();

app.use('/static', express.static(path.resolve(__dirname, 'static')));

app.use('/graphql', graphQLHTTP({ schema, pretty: true, graphiql: true }));

const compiler = webpack(config[0]);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config[0].output.publicPath,
}));

app.use(webpackHotMiddleware(compiler));
// Serve static resources
app.get('*', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <link type='image/x-icon' rel='shortcut icon'>
    </head>
    <body>
      <div id="root">${ReactDOMServer.renderToString(<App />)}</div>
      <script src="static/bundle.js"></script>
    </body>
    </html>
  `);
});

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
