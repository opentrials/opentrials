'use strict';

const escapeElasticSearch = require('../../helpers/escape-elastic-search');

describe('persons handler', () => {
  let server;

  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /persons/{id}', () => {
    describe('API is OK', () => {
      const person = JSON.parse(JSON.stringify(
        fixtures.getPerson()
      ));
      const trials = JSON.parse(JSON.stringify(
        fixtures.searchTrialsByEntity()
      ));
      let response;

      before(() => {
        apiServer.get(`/persons/${person.id}`).reply(200, person);

        mockApiResponses({
          search: {
            query: {
              q: `person:("${escapeElasticSearch(person.name)}")`,
              page: 1,
            },
            response: trials,
          },
        });

        return server.inject(`/persons/${person.id}`)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200);
      });

      it('uses the "persons-list" template', () => (
        response.request.response.source.template.should.equal('persons-details')
      ));

      it('adds the requested person to the context', () => {
        const context = response.request.response.source.context;
        context.person.should.deepEqual(person);
      });

      it('adds the trials to the context', () => {
        const context = response.request.response.source.context;
        context.trials.should.deepEqual(trials);
      });

      it('sets the title to the person.name', () => {
        const context = response.request.response.source.context;
        context.title.should.equal(person.name);
      });

      it('returns 404 when person doesnt exist', () => {
        apiServer.get('/persons/foo').reply(404);

        return server.inject('/persons/foo')
          .then((_response) => {
            _response.statusCode.should.equal(404);
          });
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/persons/foo').reply(500);

        return server.inject('/persons/foo')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });
});
