'use strict';

const server = require('../../server');

describe('terms-of-use handler', () => {
  describe('GET /terms-of-use', () => {
    describe('API is OK', () => {
      const sources = JSON.parse(JSON.stringify([
        fixtures.getSource(),
        fixtures.getSource(),
      ]));
      let response;

      beforeEach(() => {
        apiServer.get('/sources').reply(200, sources);
      });

      it('is successful', () => (
        server.inject('/terms-of-use')
          .then((response) => response.statusCode.should.equal(200))
      ));

      it('uses the "terms-of-use" template', () => (
        server.inject('/terms-of-use')
          .then((response) => response.request.response.source.template.should.equal('terms-of-use'))
      ));

      it('adds the requested person to the context', () => {
        server.inject('/terms-of-use')
          .then((response) => {
            const context = response.request.response.source.context;
            context.sources.should.deepEqual(sources);
          })
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/sources').reply(500);

        return server.inject('/terms-of-use')
          .then((response) => response.statusCode.should.equal(502))
      });
    });
  });
});

