'use strict';

const should = require('should');
const User = require('../../models/user');

describe('User', () => {

  describe('#findByEmailOrOAuth', () => {

    before(clearDB);

    afterEach(clearDB);

    it('finds users by email', () => {
      let user;

      factory.create('user')
        .then((_user) => user = _user)
        .then(() => new User().findByEmailOrOAuth(user.attributes.email).fetch())
        .then((_user) => user.attributes.id.should.eql(_user.attributes.id));
    });

    it('finds users by OAuth credentials', () => {
      let user;

      factory.create('user')
        .then((_user) => user = _user)
        .then(() => {
          const oauthCredentials = user.related('oauthCredentials').models[0];
          return new User().findByEmailOrOAuth('foo@bar.com',
                                               oauthCredentials.attributes.provider,
                                               oauthCredentials.attributes.id).fetch()
        })
        .then((_user) => user.attributes.id.should.eql(_user.attributes.id));
    });
  });

});
