const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
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
  ],
};
