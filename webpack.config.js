import ExtractTextPlugin from 'extract-text-webpack-plugin';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import webpack from 'webpack';
import fs from 'fs';
import path from 'path';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

const config = {
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
        loaders: DEBUG
          ? ['isomorphic-style-loader', 'css?modules', 'postcss']
          : ExtractTextPlugin.extract('style', 'css?modules&minimize', 'postcss',
            { publicPath: '../css' }
          ),
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
          // 'responsive?sizes[]=100,sizes[]=200,sizes[]=300',
        ],
      },
      {
        test: /\.json/,
        loaders: ['json'],
      },
    ],
  },
  postcss() {
    return [autoprefixer, precss];
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
    path: 'build',
    filename: 'server.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      __DEV__: DEBUG,
      __CLIENT__: false,
      __SERVER__: true,
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
    path: path.join(__dirname, 'build/public/js'),
    filename: 'app.[hash].js',
    chunkFilename: '[hash].[id].app.js',
  },
  plugins: [
    new AssetsPlugin({
      filename: 'assets.json',
      path: path.join(__dirname, 'build'),
    }),
    // new webpack.IgnorePlugin(/\.(png|jpg|jpeg|gif|svg)$/),
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

export default [clientConfig, serverConfig];
