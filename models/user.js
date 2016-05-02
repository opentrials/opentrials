'use strict';

require('./oauth-credential');

const bookshelf = require('../config').bookshelf;

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  oauthCredentials: function oauthCredentials() {
    return this.hasMany('OAuthCredential');
  },
  findByEmailOrOAuth: (email, oauthProvider, oauthId) => (
    new User().query((qb) => {
      qb.leftJoin('oauth_credentials', 'oauth_credentials.user_id', '=', 'users.id');
      qb.where(function userOAuthWhereClauses() {
        this.where({
          'oauth_credentials.provider': oauthProvider,
          'oauth_credentials.id': oauthId,
        });
      }).orWhere({
        'users.email': email,
      });
    })
  ),
});

module.exports = bookshelf.model('User', User);
