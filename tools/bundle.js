import webpack from 'webpack';
import webpackConfig from './webpack.config.js';

webpack(webpackConfig).run((err, stats) => {
  if (err) console.log(err);
  console.log(stats.toString(webpackConfig.stats));
});
