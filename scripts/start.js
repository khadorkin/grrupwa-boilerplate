const browserSync = require('browser-sync');
const webpack = require('webpack');
const serverConfig = require('../webpack.config.server.js');
const clientConfig = require('../webpack.config.client.js');
const runServer = require('./runServer');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

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
  webpack(serverConfig).run((errServer, serverStats) => {
    if (errServer) console.log(errServer);
    console.log(serverStats.toString(clientConfig.stats));
    webpack(clientConfig).run((errClient, clientStats) => {
      if (errClient) console.log(errClient);
      console.log(clientStats.toString(clientConfig.stats));
      runServer();
    });
  });
}
