'use strict';
const server = require('../../server');

describe('interventions handler', () => {
  describe('GET /interventions/{id}', () => {
    describe('API is OK', () => {
      const intervention = JSON.parse(JSON.stringify(
        fixtures.getIntervention()
      ));
      let response;

      before(() => {
        apiServer.get('/interventions/'+intervention.id).reply(200, intervention);

        return server.inject('/interventions/'+intervention.id)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('uses the "interventions-list" template', () => (
        response.request.response.source.template.should.equal('interventions-details')
      ));

      it('adds the requested intervention to the context', () => {
        const context = response.request.response.source.context;
        context.intervention.should.deepEqual(intervention);
      });

      it('sets the title to the intervention.name', () => {
        const context = response.request.response.source.context;
        context.title.should.equal(intervention.name);
      });

      it('returns 404 when intervention doesnt exist', () => {
        apiServer.get('/interventions/foo').reply(404);

        return server.inject('/interventions/foo')
          .then((_response) => {
            _response.statusCode.should.equal(404);
          });
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/interventions/foo').reply(500);

        return server.inject('/interventions/foo')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });
});
