import graphQLHTTP from 'express-graphql';
import path from 'path';
import express from 'express';
import { schema } from './data/schema';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../webpack.config.dev.js';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({ schema, pretty: true, graphiql: true }));
graphQLServer.listen(GRAPHQL_PORT, () =>
  console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`)
);

const compiler = webpack(webpackConfig);

const app = new WebpackDevServer(compiler, {
  contentBase: '/static/',
  proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
  },
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'static')));

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
