import browserSync from 'browser-sync';
import webpack from 'webpack';
import serverConfig from '../webpack.config.server.js';
import clientConfig from '../webpack.config.client.js';
import runServer from './runServer';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

let handleServerBundleComplete = () => {
  runServer();

  const bundler = webpack(clientConfig);
  const bs = browserSync.create();
  bs.init({
    proxy: {
      target: 'http://localhost:3000',
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: clientConfig.output.publicPath,
          noInfo: true,
        }),
        webpackHotMiddleware(bundler),
      ],
    },
    port: 3001,
  });
  handleServerBundleComplete = runServer;
};

webpack(serverConfig).watch({
  aggregateTimeout: 300,
  poll: true,
}, (err, stats) => {
  handleServerBundleComplete();
});
