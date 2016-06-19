import browserSync from 'browser-sync';
import webpack from 'webpack';
import serverConfig from '../webpack.config.server.js';
import clientConfig from '../webpack.config.client.js';
import runServer from './runServer';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const DEBUG = !process.argv.includes('--release');

let handleServerBundleComplete = () => {
  runServer();

  const bundler = webpack(clientConfig);
  const bs = browserSync.create();

  bs.init({
    proxy: {
      ...DEBUG ? {} : { notify: false, ui: false },
      target: 'http://localhost:3000',
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: clientConfig.output.publicPath,
          stats: clientConfig.stats,
        }),
        webpackHotMiddleware(bundler),
      ],
    },
    port: 3001,
  });

  handleServerBundleComplete = runServer;
};

if (DEBUG) {
  webpack(serverConfig).watch({
    aggregateTimeout: 300,
    poll: true,
  }, (err, stats) => {
    if (err) console.log(err);
    console.log(stats.toString(clientConfig.stats));
    handleServerBundleComplete();
  });
} else {
  webpack(serverConfig).run((err, stats) => {
    if (err) console.log(err);
    console.log(stats.toString(clientConfig.stats));
    webpack(clientConfig).run((err, stats) => {
      if (err) console.log(err);
      console.log(stats.toString(clientConfig.stats));
      runServer();
    });
  });
}