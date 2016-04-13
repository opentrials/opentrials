'use strict';
const server = require('../../server');

describe('homepage handler', () => {
  describe('GET /', () => {
    const locationsResponse = [
      fixtures.getLocation(),
      fixtures.getLocation(),
    ];
    let response;

    before(() => {
      mockApiResponses({
        locations: {
          response: locationsResponse,
        },
      });

      return server.inject('/')
        .then((_response) => {
          response = _response;
        });
    });

    after(() => {
      cleanAllApiMocks();
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

    it('adds the locations into the context', () => {
      const context = response.request.response.source.context;
      context.locations.should.deepEqual(locationsResponse);
    });
  });
});
