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

      it('is not found', () => {
        response.statusCode.should.equal(404)
      });
    });
  });
});
