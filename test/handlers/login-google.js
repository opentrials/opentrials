'use strict';

const should = require('should');
const server = require('../../server');
const loginHandler = require('../../handlers/login-google');
const User = require('../../models/user');

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
            id: '000000000000000000000',
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
        .then(() => new User({ email: userData.email }).fetch()
                      .then((user) => should(user.attributes).containDeep(userData)));
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
                id: '000000000000000000000',
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
