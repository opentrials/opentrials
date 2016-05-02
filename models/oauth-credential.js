'use strict';

require('./user');

const bookshelf = require('../config').bookshelf;

const OAuthCredential = bookshelf.Model.extend({
  tableName: 'oauth_credentials',
  user: function user() {
    return this.belongsTo('User');
  },
});

module.exports = bookshelf.model('OAuthCredential', OAuthCredential);
