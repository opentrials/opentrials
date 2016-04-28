'use strict';

const server = require('../../server');

describe('homepage handler', () => {
  describe('GET /', () => {
    let response;

    before(() => {
      return server.inject('/')
        .then((_response) => {
          response = _response;
        });
    });

    it('is successful', () => (
      response.statusCode.should.equal(200)
    ));

    it('uses the "index" template', () => (
      response.request.response.source.template.should.equal('index')
    ));

    it('sets the title', () => {
      const context = response.request.response.source.context;
      context.should.have.property('title');
    });
  });
});
