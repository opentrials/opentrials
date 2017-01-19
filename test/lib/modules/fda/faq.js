'use strict';

describe('FDA About Handler', () => {
  let server;

  before(() => getFDAServer().then((_server) => (server = _server)));

  describe('GET /faq', () => {
    it('is successful', () => (
      server.inject('/faq')
        .then((response) => {
          response.statusCode.should.equal(200);
        })
    ));

    it('uses the "fda/faq" template', () => (
      server.inject('/faq')
        .then((response) => {
          response.request.response.source.template.should.equal('fda/faq');
        })
    ));

    it('sets the title', () => (
      server.inject('/faq')
        .then((response) => {
          const context = response.request.response.source.context;
          context.should.have.property('title');
        })
    ));
  });
});
