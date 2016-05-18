'use strict';
const server = require('../../server');

describe('stats handler', () => {
  describe('GET /stats', () => {
    describe('API is OK', () => {
      const stats = JSON.parse(JSON.stringify(
        fixtures.getStats()
      ));
      let response;

      before(() => {
        apiServer.get('/stats').reply(200, stats);

        return server.inject('/stats')
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('adds the requested stats info to the context', () => {
        const context = response.request.response.source.context;
        context.stats.should.deepEqual(stats);
      });

      it('uses the "stats" template', () => (
        response.request.response.source.template.should.equal('stats')
      ));

      it('sets the title to the Statistics', () => {
        const context = response.request.response.source.context;
        context.title.should.equal('Statistics');
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        mockApiResponses({
          stats: { statusCode: 500 },
        });

        return server.inject('/stats')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });
});
