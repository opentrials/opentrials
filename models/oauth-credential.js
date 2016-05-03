'use strict';

require('./user');

const bookshelf = require('../config').bookshelf;

const OAuthCredential = bookshelf.Model.extend({
  tableName: 'oauth_credentials',
  user: function user() {
    return this.belongsTo('User');
  },
  createIfInexistent: function createIfInexistent(attrs) {
    return new OAuthCredential(attrs).save(null, { method: 'insert' })
      .catch((err) => {
        const modelAlreadyExists = (err.code === '23505');
        if (!modelAlreadyExists) {
          throw err;
        }

        return new OAuthCredential(attrs).fetch();
      });
  },
});

module.exports = bookshelf.model('OAuthCredential', OAuthCredential);
