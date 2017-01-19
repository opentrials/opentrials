'use strict';

const should = require('should');
const User = require('../../models/user');

describe('login handler', () => {
  let server;

  before(() => (
    clearDB()
      .then(() => getExplorerServer())
      .then((_server) => (server = _server))
  ));

  afterEach(clearDB);

  describe('POST /login/google', () => {
    it('creates a new user and OAuthCredential and redirects to index', () => {
      const options = {
        url: '/login/google',
        method: 'GET',
        credentials: {
          provider: 'google',
          profile: {
            id: '123',
            displayName: 'Foo Bar',
            email: 'foo@bar.com',
          },
        },
      };
      const profile = options.credentials.profile;
      const userData = {
        name: profile.displayName,
        email: profile.email,
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

    it('redirects to Google OAuth2 endpoint if not logged in', () => server.inject('/login/google')
        .then((response) => {
          response.statusCode.should.eql(302);
          should(response.headers.location).startWith('https://accounts.google.com/o/oauth2/');
        }));

    it('returns status code 400 if login wasn\'t authorized', () => server.inject('/login/google?error=access_denied')
        .then((response) => response.statusCode.should.eql(400)));
  });

  describe('POST /login/facebook', () => {
    it('creates a new user and OAuthCredential and redirects to index', () => {
      const options = {
        url: '/login/facebook',
        method: 'GET',
        credentials: {
          provider: 'facebook',
          profile: {
            id: '123',
            displayName: 'Foo Bar',
            email: 'foo@bar.com',
          },
        },
      };
      const profile = options.credentials.profile;
      const userData = {
        name: profile.displayName,
        email: profile.email,
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

    it('creates new user even when she has no email', () => {
      const options = {
        url: '/login/facebook',
        method: 'GET',
        credentials: {
          provider: 'facebook',
          profile: {
            id: '123',
            displayName: 'Foo Bar',
          },
        },
      };

      return new User().findByEmailOrOAuth(undefined, 'facebook', '123').fetch()
        .then((user) => should(user).be.null())
        .then(() => server.inject(options))
        .then(() => new User().findByEmailOrOAuth(undefined, 'facebook', '123').fetch())
        .then((user) => should(user).be.not.null());
    });

    it('redirects to Facebook OAuth2 endpoint if not logged in', () => server.inject('/login/facebook')
        .then((response) => {
          response.statusCode.should.eql(302);
          should(response.headers.location).startWith('https://www.facebook.com');
        }));

    it('returns status code 400 if login wasn\'t authorized', () => server.inject('/login/facebook?error=access_denied')
        .then((response) => response.statusCode.should.eql(400)));
  });
});
