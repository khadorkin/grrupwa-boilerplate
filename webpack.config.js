import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import webpack from 'webpack';
import fs from 'fs';
import path from 'path';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

const config = {
  output: {
    path: path.join(__dirname, 'build/public/assets'),
    publicPath: '/assets/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        query: {
          cacheDirectory: true,
          ...DEBUG ? {
            plugins: [
              'react-hot-loader/babel',
              path.join(__dirname, 'scripts/babelRelayPlugin'),
            ],
          } : {
            plugins: [path.join(__dirname, 'scripts/babelRelayPlugin')],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: ['isomorphic-style-loader', 'css?modules', 'postcss'],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
        ],
      },
      {
        test: /\.json/,
        loaders: ['json'],
      },
    ],
  },
  postcss() {
    return [
      autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }),
      precss,
    ];
  },
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
  devtool: 'source-map',
};

const serverConfig = extend(true, {}, config, {
  entry: [
    ...DEBUG ? ['webpack/hot/poll'] : [],
    './src/server',
  ],
  output: {
    filename: '../../server.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      __DEV__: DEBUG,
      __CLIENT__: false,
      __SERVER__: true,
    }),
    new ImageminPlugin({
      disable: DEBUG,
      optipng: {
        optimizationLevel: 7,
      },
      jpegtran: {
        progressive: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: !DEBUG,
      debug: DEBUG,
    }),
    ...DEBUG ? [
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false,
      }),
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
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  target: 'node',
  externals: nodeModules,
});

const clientConfig = extend(true, {}, config, {
  entry: [
    ...DEBUG ? [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
    ] : [],
    './src/client',
  ],
  output: {
    filename: 'app.[hash].js',
    chunkFilename: '[hash].[id].app.js',
  },
  plugins: [
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.join(__dirname, 'build'),
    }),
    new ImageminPlugin({
      disable: DEBUG,
      optipng: {
        optimizationLevel: 7,
      },
      jpegtran: {
        progressive: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      __DEV__: DEBUG,
      __CLIENT__: true,
      __SERVER__: false,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: !DEBUG,
      debug: DEBUG,
    }),
    ...DEBUG ? [
      new webpack.HotModuleReplacementPlugin(),
    ] : [
      new ExtractTextPlugin('../css/styles.css'),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE,
        },
      }),
    ],
  ],
});

// TODO: Find a way to include this inside clientConfig without hardcoding
// index to loaders
// Transform client config to output a css file for browser if in production mode
clientConfig.module.loaders[1] = {
  test: /\.css$/,
  loaders: DEBUG
    ? ['style', 'css?modules', 'postcss']
    : ExtractTextPlugin.extract('style', 'css?modules&minimize!postcss'),
  exclude: /node_modules/,
};

export default [clientConfig, serverConfig];
