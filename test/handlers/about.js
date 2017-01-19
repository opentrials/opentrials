'use strict';

describe('about handler', () => {
  let server;
  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /about', () => {
    let response;

    before(() => (
      server.inject('/about')
        .then((_response) => {
          response = _response;
        })
    ));

    it('is successful', () => {
      response.statusCode.should.equal(200);
    });

    it('uses the "about" template', () => (
      response.request.response.source.template.should.equal('about')
    ));

    it('sets the title', () => {
      const context = response.request.response.source.context;
      context.should.have.property('title');
    });
  });
});
