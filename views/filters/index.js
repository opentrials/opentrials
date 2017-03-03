'use strict';

const revPath = require('./rev-path');
const formatDate = require('./format-date');
const formatNumber = require('./format-number');
const underscoresToCapitalized = require('./underscores-to-capitalized');
const formatObject = require('./format-object');
const formatBytes = require('./format-bytes');
const gravatar = require('./gravatar');

const filters = {
  revPath,
  formatDate,
  formatNumber,
  underscoresToCapitalized,
  formatObject,
  formatBytes,
  gravatar,
};

module.exports = filters;
