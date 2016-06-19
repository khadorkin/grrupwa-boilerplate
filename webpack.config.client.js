import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import path from 'path';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const clientConfig = {
  devtool: 'source-map',
  entry: [
    ...DEBUG ? [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
    ] : [],
    './src/client',
  ],
  output: {
    path: path.join(__dirname, 'build/static'),
    filename: 'app.js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
    }),
    ...DEBUG ? [
      new webpack.HotModuleReplacementPlugin(),
    ] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE,
        },
      }),
    ],
  ],
  cache: DEBUG,
  debug: DEBUG,
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        query: {
          plugins: DEBUG ? ['react-hot-loader/babel'] : [],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules&importLoaders=1', 'postcss'],
        exclude: /node_modules/,
      },
    ],
  },
  postcss() {
    return [autoprefixer];
  },
};

export default clientConfig;
