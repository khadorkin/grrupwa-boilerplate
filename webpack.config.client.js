import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

const DEBUG = !process.argv.includes('--release');

const clientConfig = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    './src/client',
  ],
  output: {
    path: path.join(__dirname, '../build/static'),
    filename: 'app.js',
    publicPath: '/static/',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        query: {
          plugins: ['react-hot-loader/babel'],
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
