delete require.cache[require.resolve('./webpack.utils')];

const fse = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const client = require('./client');
const configs = require('./site/configs');
const webpackUtils = require('./webpack.utils');
const restartServer = require('./ops/scripts/restart-app');

const { WebpackOnBuildPlugin } = client.plugins;

let manifest = {};

module.exports = {
  entry: client.entry,
  output: {
    path: path.resolve('site/static/js/'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: Object.assign({}, configs.getBabelrcByBrowserQuery('defaults')),
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoader: 2,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([
      'site/static/js/',
      'site/static/css/',
      'site/static/manifest.json',
    ], {}),
    new WebpackOnBuildPlugin({
      onEmit: (compilation, callback) => {
        manifest = webpackUtils.setChunksHashesToManifest(compilation, manifest);
        callback();
      },
      onFinish: () => {
        fse.outputFileSync('site/static/manifest.json', JSON.stringify(manifest));
        restartServer();
      },
    }),
    new webpack.DefinePlugin(Object.keys(process.env).reduce((resObj, key) => {
      const obj = resObj;
      obj['process.env'] = {};
      obj[`process.env.${key}`] = process.env[key];
      return obj;
    }, {})),
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
    }),
  ],
};
