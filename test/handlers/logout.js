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

    it('redirects to the index when there\'s no referer', () => {
      return server.inject('/logout')
        .then((response) => {
          response.statusCode.should.eql(302);
          should(response.headers.location).eql('/');
        });
    });

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
    })
  });
});
