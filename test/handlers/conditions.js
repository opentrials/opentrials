'use strict';

const escapeElasticSearch = require('../../helpers/escape-elastic-search');

describe('conditions handler', () => {
  let server;

  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /conditions/{id}', () => {
    describe('API is OK', () => {
      const condition = JSON.parse(JSON.stringify(
        fixtures.getCondition()
      ));
      const trials = JSON.parse(JSON.stringify(
        fixtures.searchTrialsByEntity()
      ));
      let response;

      before(() => {
        apiServer.get(`/conditions/${condition.id}`).reply(200, condition);

        mockApiResponses({
          search: {
            query: {
              q: `condition:("${escapeElasticSearch(condition.name)}")`,
              page: 1,
            },
            response: trials,
          },
        });

        return server.inject(`/conditions/${condition.id}`)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200);
      });

      it('uses the "conditions-list" template', () => (
        response.request.response.source.template.should.equal('conditions-details')
      ));

      it('adds the requested condition to the context', () => {
        const context = response.request.response.source.context;
        context.condition.should.deepEqual(condition);
      });

      it('adds the trials to the context', () => {
        const context = response.request.response.source.context;
        context.trials.should.deepEqual(trials);
      });

      it('sets the title to the condition.name', () => {
        const context = response.request.response.source.context;
        context.title.should.equal(condition.name);
      });

      it('returns 404 when condition doesnt exist', () => {
        apiServer.get('/conditions/foo').reply(404);

        return server.inject('/conditions/foo')
          .then((_response) => {
            _response.statusCode.should.equal(404);
          });
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/conditions/foo').reply(500);

        return server.inject('/conditions/foo')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });
});
