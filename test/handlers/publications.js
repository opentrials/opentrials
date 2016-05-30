'use strict';
const server = require('../../server');

describe('publications handler', () => {
  describe('GET /publications/{id}', () => {
    describe('API is OK', () => {
      const publication = JSON.parse(JSON.stringify(
        fixtures.getPublication()
      ));
      let response;

      before(() => {
        apiServer.get(`/publications/${publication.id}`).reply(200, publication);

        return server.inject(`/publications/${publication.id}`)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('uses the "publications-list" template', () => (
        response.request.response.source.template.should.equal('publications-details')
      ));

      it('adds the requested publication to the context', () => {
        const context = response.request.response.source.context;
        context.publication.should.deepEqual(publication);
      });

      it('sets the title to the publication.title', () => {
        const context = response.request.response.source.context;
        context.title.should.equal(publication.title);
      });

      it('returns 404 when publication doesnt exist', () => {
        apiServer.get('/publications/foo').reply(404);

        return server.inject('/publications/foo')
          .then((_response) => {
            _response.statusCode.should.equal(404);
          });
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/publications/foo').reply(500);

        return server.inject('/publications/foo')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });
});
