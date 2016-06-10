'use strict';

const should = require('should');
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

  describe('GET /?advanced_search={advanced_search}', () => {
    it('sets advancedSearchIsVisible to false by default', () => {
      return server.inject('/')
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.advancedSearchIsVisible).be.false();
        });
    });

    it('sets advancedSearchIsVisible to true when advanced_search is true', () => {
      return server.inject('/?advanced_search=true')
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.advancedSearchIsVisible).be.true();
        });
    });
  });
});
