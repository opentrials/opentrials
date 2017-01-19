'use strict';

const should = require('should');
const User = require('../../models/user');

describe('User', () => {
  before(clearDB);

  afterEach(clearDB);

  describe('#findByEmailOrOAuth', () => {
    it('finds users by email', () => {
      let user;

      factory.create('user')
        .then((_user) => (user = _user))
        .then(() => new User().findByEmailOrOAuth(user.attributes.email).fetch())
        .then((_user) => user.attributes.id.should.eql(_user.attributes.id));
    });

    it('finds users by OAuth credentials', () => {
      let user;

      factory.create('user')
        .then((_user) => (user = _user))
        .then(() => {
          const oauthCredentials = user.related('oauthCredentials').models[0];
          return new User().findByEmailOrOAuth('foo@bar.com',
                                               oauthCredentials.attributes.provider,
                                               oauthCredentials.attributes.id)
                           .fetch({ require: true });
        })
        .then((_user) => user.attributes.id.should.eql(_user.attributes.id));
    });
  });

  describe('#findOrCreateByEmail', () => {
    it('creates user and OAuthCredential when both don\'t exist', () => {
      let user;
      let oauthCredential;

      return Promise.all([
        factory.build('user'),
        factory.build('oauthCredential'),
      ]).then((models) => {
        user = models[0];
        oauthCredential = models[1];
        const userAttrs = {
          name: user.attributes.name,
          email: user.attributes.email,
        };

        return new User().findOrCreateByEmail(userAttrs,
                                              oauthCredential.attributes.provider,
                                              oauthCredential.attributes.id);
      }).then((_user) => new User({ id: _user.attributes.id }).fetch({
        require: true,
        withRelated: 'oauthCredentials',
      })).then((_user) => {
        const originalOAuthAttrs = oauthCredential.toJSON();
        delete originalOAuthAttrs.user_id;

        _user.related('oauthCredentials').models[0].toJSON().should.containDeep(originalOAuthAttrs);
      });
    });
  });

  describe('#scope', () => {
    it('returns the user "role" as "scope"', () => {
      const user = new User({ role: 'foobar' });

      should(user.toJSON().scope).eql('foobar');
    });
  });
});
