const server = require('../../server');

describe('search handler', () => {
  const apiResponse = JSON.parse(JSON.stringify({
    total_count: 2,
    items: [
      fixtures.getTrial(),
      fixtures.getTrial(),
    ],
  }));
  let response;

  describe('GET /search', () => {
    describe('API is OK', () => {
      before(() => {
        apiServer.get('/search').reply(200, apiResponse);

        return server.inject('/search')
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('uses the "search" template', () => (
        response.request.response.source.template.should.equal('search')
      ));

      it('adds the trials into the context', () => {
        const context = response.request.response.source.context;

        context.results.should.deepEqual(apiResponse);
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/search').reply(500);

        return server.inject('/search')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });

  describe('GET /search?q={query}', () => {
    const query = 'foo bar';

    before(() => {
      apiServer.get('/search?q='+encodeURI(query)).reply(200, apiResponse);

      return server.inject('/search?q='+encodeURI(query))
        .then((_response) => {
          response = _response;
        });
    });

    it('adds the query into the context', () => {
      response.request.response.source.context.query.should.equal(query)
    });
  });
});
