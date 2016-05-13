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
  virtuals: {
    filename: function filename() {
      const filenameRegexp = /.*uploads\/[^\/]+\/(.+)/;

      return this.attributes.url.match(filenameRegexp)[1];
    },
  },
});

module.exports = bookshelf.model('DataContribution', DataContribution);
