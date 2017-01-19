'use strict';

const should = require('should');


describe('FDA Index Handler', () => {
  let server;

  before(() => getFDAServer().then((_server) => (server = _server)));

  describe('GET /', () => {
    it('redirects to /search', () => (
      server.inject('/')
        .then((response) => {
          should(response.statusCode).eql(302);
          should(response.headers.location).eql('/search');
        })
    ));
  });
});
