import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import fs from 'fs';
import path from 'path';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

const serverConfig = {
  devtool: 'source-map',
  entry: [
    ...DEBUG ? ['webpack/hot/poll'] : [],
    './src/server',
  ],
  output: {
    path: 'build',
    filename: 'server.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      __DEV__: DEBUG,
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
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        query: {
          ...DEBUG ? {
            plugins: [path.join(__dirname, 'scripts/babelRelayPlugin')],
            cacheDirectory: true,
          } : {},
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loaders: ['isomorphic-style-loader', 'css?modules', 'postcss'],
        exclude: /node_modules/,
      },
    ],
  },
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
  postcss() {
    return [autoprefixer];
  },
};

export default serverConfig;
