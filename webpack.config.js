'use strict';

require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: path.join(__dirname, 'assets', 'js', 'index.js'),
    vendor: path.join(__dirname, 'assets', 'js', 'vendor', 'index.js'),
  },

  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: '[name].min.js',
    publicPath: '/js/',
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      OPENTRIALS_API_URL: `'${process.env.OPENTRIALS_API_URL}'`,
    }),
  ],
};
