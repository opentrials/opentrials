'use strict';

require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: path.join(__dirname, 'assets', 'js', 'index.js'),
    fileupload: path.join(__dirname, 'assets', 'js', 'fileupload.js'),
    vendor: path.join(__dirname, 'assets', 'js', 'vendor', 'index.js'),
  },

  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: '[name].min.js',
    publicPath: '/js/',
  },

  externals: {
    $: 'jQuery',
    jquery: 'jQuery',
    'window.jQuery': 'jQuery',
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      OPENTRIALS_API_URL: `'${process.env.OPENTRIALS_API_URL}'`,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: 2,
    }),
  ],

  resolve: {
    extensions: ['', '.js'],
    root: [
      path.resolve('./node_modules'),
    ],
    alias: {
      'jquery.ui.widget': 'jquery-ui/ui/widget.js',
      'jquery.mmenu': 'jquery.mmenu/dist/js/jquery.mmenu.min.js',
      'nodep-date-input-polyfill': 'nodep-date-input-polyfill/nodep-date-input-polyfill.dist.js',
    },
  },
};
