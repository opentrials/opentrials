'use strict';

const should = require('should');
const server = require('../../server');

describe('logout handler', () => {
  describe('GET /logout', () => {
    it('clear the credentials cookies', () => {
      return server.inject('/logout')
        .then((response) => {
          const setCookies = response.headers['set-cookie'];

          should(setCookies).not.be.undefined();
          should(setCookies[0]).startWith('sid=;');
        });
    });

    it('redirects to the index', () => {
      return server.inject('/logout')
        .then((response) => {
          response.statusCode.should.eql(302);
          should(response.headers.location).eql('/');
        });
    });
  });
});
