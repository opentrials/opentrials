'use strict';

require('./data-contribution');

const bookshelf = require('../config').bookshelf;


const DataCategory = bookshelf.Model.extend({
  tableName: 'data_categories',
});

module.exports = bookshelf.model('DataCategory', DataCategory);
