import browserSync from 'browser-sync';
import webpack from 'webpack';
import serverConfig from '../webpack.config.server.js';
import clientConfig from '../webpack.config.client.js';
import runServer from './runServer';
import run from './run';
import copy from './copy';
import clean from './clean';
import precache from './precache';
import build from './build';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const DEBUG = !process.argv.includes('--release');

async function start() {
  await run(clean);
  await run(build);
  await run(copy.bind(undefined, { watch: true }));

  if (!DEBUG) {
    // We do not want to use Service Worker because:
    // 1. It will serve app.js from Service Worker, invalidating SSR (But, we could hash the bundle)
    // 2. To update, we have to whitelist runtimeCaching (fetch from SW will disrupt updates)
    await run(precache);
    runServer();
    return;
  }

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
            noInfo: true,
            publicPath: clientConfig.output.publicPath,
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
    if (err) console.log(err);
    console.log(stats.toString(clientConfig.stats));
    handleServerBundleComplete();
  });
}

export default start;
