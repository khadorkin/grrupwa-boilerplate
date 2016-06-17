import webpack from 'webpack';
import webpackConfig from '../webpack.config.server.js';

const bundler = webpack(webpackConfig);

bundler.run((err, stats) => {
  if (err) console.log(err);
  console.log(stats.toString(webpackConfig.stats));
});
