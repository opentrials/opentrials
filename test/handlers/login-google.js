'use strict';

const should = require('should');
const server = require('../../server');
const loginHandler = require('../../handlers/login-google');
const User = require('../../models/user');
const OAuthCredential = require('../../models/oauth-credential');

describe('login-google handler', () => {

  before(clearDB);

  afterEach(clearDB);

  describe('POST /login/google', () => {
    it('creates a new user and redirects to index', () => {
      const options = {
        url: '/login/google',
        method: 'GET',
        credentials: {
          provider: 'google',
          profile: {
            id: '123',
            displayName: 'Foo Bar',
            emails: [
              { value: 'foo@bar.com', type: 'account' },
              { value: 'foo@foobar.com', type: 'account' },
            ]
          },
        },
      };
      const profile = options.credentials.profile;
      const userData = {
        name: profile.displayName,
        email: profile.emails[0].value,
      };

      return new User({ email: userData.email }).fetch()
        .then((user) => should(user).be.null())
        .then(() => server.inject(options))
        .then((response) => {
          response.statusCode.should.eql(302);
          should(response.headers.location).eql('/');
        })
        .then(() => new User({ email: userData.email }).fetch({ withRelated: 'oauthCredentials' }))
        .then((user) => {
          const oauthCredentials = user.related('oauthCredentials').models;
          should(user.attributes).containDeep(userData);
          oauthCredentials.length.should.eql(1);
          oauthCredentials[0].toJSON().should.deepEqual({
            id: profile.id,
            provider: options.credentials.provider,
            user_id: user.attributes.id,
          });
        });
    });

    it('creates and assign the OAuthCredential to the user', () => {
      let user;

      return factory.create('user')
        .then((_user) => {
          user = _user;
          const options = {
            url: '/login/google',
            method: 'GET',
            credentials: {
              provider: 'google',
              profile: {
                id: '123',
                displayName: user.attributes.name,
                emails: [
                  { value: user.attributes.email, type: 'account' },
                  { value: 'foo@foobar.com', type: 'account' },
                ]
              },
            },
          };

          return server.inject(options);
        })
        .then(() => new OAuthCredential({
          provider: 'google',
          id: '123',
          user_id: user.attributes.id
        }).fetch({ require: true }))
    });

    it('loads existing user if theres one with the same email', () => {
      let userCount;

      return User.count()
        .then((_userCount) => userCount = Number(_userCount))
        .then(() => factory.create('user'))
        .then((user) => {
          const options = {
            url: '/login/google',
            method: 'GET',
            credentials: {
              provider: 'google',
              profile: {
                id: '123',
                displayName: user.attributes.name,
                emails: [
                  { value: user.attributes.email, type: 'account' },
                  { value: 'foo@foobar.com', type: 'account' },
                ]
              },
            },
          };
          return server.inject(options);
        })
        .then(() => User.count())
        .then((_userCount) => Number(_userCount).should.eql(userCount + 1));
    });

    it('loads existing user if theres one with the same OAuth credential', () => {
      let userCount;

      return User.count()
        .then((_userCount) => userCount = Number(_userCount))
        .then(() => factory.create('user'))
        .then((user) => {
          const options = {
            url: '/login/google',
            method: 'GET',
            credentials: {
              provider: 'google',
              profile: {
                id: user.related('oauthCredentials').models[0].attributes.id,
                displayName: user.attributes.name,
                emails: [
                  { value: `different${user.attributes.email}`, type: 'account' },
                ]
              },
            },
          };

          return server.inject(options);
        })
        .then(() => User.count())
        .then((_userCount) => Number(_userCount).should.eql(userCount + 1));
    });

    it('redirects to Google OAuth2 endpoint if not logged in', () => {
      return server.inject('/login/google')
        .then((response) => {
          response.statusCode.should.eql(302);
          should(response.headers.location).startWith('https://accounts.google.com/o/oauth2/');
        });
    });

    it('returns status code 400 if login wasnt authorized', () => {
      return server.inject('/login/google?error=access_denied')
        .then((response) => response.statusCode.should.eql(400));
    });
  });
});
