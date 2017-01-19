'use strict';

const should = require('should');

describe('homepage handler', () => {
  let server;

  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /', () => {
    let response;

    before(() => server.inject('/')
        .then((_response) => {
          response = _response;
        }));

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

  describe('GET /?advanced_search={advanced_search}', () => {
    it('sets advancedSearchIsVisible to false by default', () => server.inject('/')
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.advancedSearchIsVisible).be.false();
        }));

    it('sets advancedSearchIsVisible to true when advanced_search is true', () => server.inject('/?advanced_search=true')
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.advancedSearchIsVisible).be.true();
        }));
  });
});
