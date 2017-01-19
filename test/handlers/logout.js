'use strict';

const should = require('should');

describe('logout handler', () => {
  let server;

  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /logout', () => {
    it('clear the credentials cookies', () => server.inject('/logout')
        .then((response) => {
          const setCookies = response.headers['set-cookie'];

          should(setCookies).not.be.undefined();
          should(setCookies[0]).startWith('sid=;');
        }));

    it('redirects to the index when there\'s no referer', () => server.inject('/logout')
        .then((response) => {
          response.statusCode.should.eql(302);
          should(response.headers.location).eql('/');
        }));

    it('redirects to the referer when it exists', () => {
      const options = {
        url: '/logout',
        headers: {
          referer: '/foo',
        },
      };

      return server.inject(options)
        .then((response) => {
          response.statusCode.should.eql(302);
          should(response.headers.location).eql('/foo');
        });
    });
  });
});
