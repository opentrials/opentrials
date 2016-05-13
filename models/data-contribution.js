'use strict';

require('./user');

const bookshelf = require('../config').bookshelf;
const BaseModel = require('./base');


const DataContribution = BaseModel.extend({
  tableName: 'data_contributions',
  hasTimestamps: true,
  user: function user() {
    // istanbul ignore next
    return this.belongsTo('User');
  },
});

module.exports = bookshelf.model('DataContribution', DataContribution);
