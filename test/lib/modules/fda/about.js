'use strict';

describe('FDA About Handler', () => {
  let server;

  before(() => getFDAServer().then((_server) => (server = _server)));

  describe('GET /about', () => {
    it('is successful', () => (
      server.inject('/about')
        .then((response) => {
          response.statusCode.should.equal(200);
        })
    ));

    it('uses the "fda/about" template', () => (
      server.inject('/about')
        .then((response) => {
          response.request.response.source.template.should.equal('fda/about');
        })
    ));

    it('sets the title', () => (
      server.inject('/about')
        .then((response) => {
          const context = response.request.response.source.context;
          context.should.have.property('title');
        })
    ));
  });
});

