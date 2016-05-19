'use strict';
const server = require('../../server');

describe('conditions handler', () => {
  describe('GET /conditions/{id}', () => {
    describe('API is OK', () => {
      const condition = JSON.parse(JSON.stringify(
        fixtures.getCondition()
      ));
      let response;

      before(() => {
        apiServer.get('/conditions/'+condition.id).reply(200, condition);

        return server.inject('/conditions/'+condition.id)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('uses the "conditions-list" template', () => (
        response.request.response.source.template.should.equal('conditions-details')
      ));

      it('adds the requested condition to the context', () => {
        const context = response.request.response.source.context;
        context.condition.should.deepEqual(condition);
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
