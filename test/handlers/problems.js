'use strict';
const server = require('../../server');

describe('problems handler', () => {
  describe('GET /problems/{id}', () => {
    describe('API is OK', () => {
      const problem = JSON.parse(JSON.stringify(
        fixtures.getProblem()
      ));
      let response;

      before(() => {
        apiServer.get('/problems/'+problem.id).reply(200, problem);

        return server.inject('/problems/'+problem.id)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('uses the "problems-list" template', () => (
        response.request.response.source.template.should.equal('problems-details')
      ));

      it('adds the requested problem to the context', () => {
        const context = response.request.response.source.context;
        context.problem.should.deepEqual(problem);
      });

      it('sets the title to the problem.name', () => {
        const context = response.request.response.source.context;
        context.title.should.equal(problem.name);
      });

      it('returns 404 when problem doesnt exist', () => {
        apiServer.get('/problems/foo').reply(404);

        return server.inject('/problems/foo')
          .then((_response) => {
            _response.statusCode.should.equal(404);
          });
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/problems/foo').reply(500);

        return server.inject('/problems/foo')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });
});
