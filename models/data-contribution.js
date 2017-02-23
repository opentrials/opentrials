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
      const filenameRegexp = /.*uploads\/[^/]+\/(.+)/;
      const dataUrl = this.attributes.data_url;
      let result;

      if (dataUrl) {
        result = dataUrl.match(filenameRegexp)[1];
      }

      return result;
    },
  },
}, {
  relatedModels: [
    'user',
  ],
});

module.exports = bookshelf.model('DataContribution', DataContribution);
