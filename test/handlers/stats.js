'use strict';

describe('stats handler', () => {
  let server;

  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /stats', () => {
    let response;

    before(() => (
      server.inject('/stats')
        .then((_response) => {
          response = _response;
        })
    ));

    it('is successful', () => (
      response.statusCode.should.equal(200)
    ));

    it('uses the "stats" template', () => (
      response.request.response.source.template.should.equal('stats')
    ));

    it('sets the title', () => {
      const context = response.request.response.source.context;
      context.should.have.property('title');
    });
  });
});
