'use strict';

const bookshelf = require('../config').bookshelf;
const uuid = require('node-uuid');
const OAuthCredential = require('./oauth-credential');

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
  findOrCreateByEmail: (userAttrs, oauthProvider, oauthId) => (
    new User().findByEmailOrOAuth(userAttrs.email, oauthProvider, oauthId).fetch()
      .then((user) => {
        let _user = user;

        if (_user === null) {
          const attrs = Object.assign({
            id: uuid.v1(),
          }, userAttrs);

          _user = new User(attrs).save(null, { method: 'insert' });
        }

        return _user;
      }).then((user) => {
        const oauthAttrs = {
          provider: oauthProvider,
          id: oauthId,
          user_id: user.attributes.id,
        };

        return new OAuthCredential().createIfInexistent(oauthAttrs)
          .then(() => user);
      })
  ),
});

module.exports = bookshelf.model('User', User);
