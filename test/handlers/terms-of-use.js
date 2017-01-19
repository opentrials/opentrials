'use strict';

const _ = require('lodash');

describe('terms-of-use handler', () => {
  let server;

  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /terms-of-use', () => {
    describe('API is OK', () => {
      const sources = _.orderBy(JSON.parse(JSON.stringify([
        fixtures.getSource(),
        fixtures.getSource(),
      ])), 'name', 'desc');

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

      it('adds the sources sorted by name to the context', () => (
        server.inject('/terms-of-use')
          .then((response) => {
            const context = response.request.response.source.context;
            const sortedSources = _.sortBy(sources, 'name');
            context.sources.should.deepEqual(sortedSources);
          })
      ));
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/sources').reply(500);

        return server.inject('/terms-of-use')
          .then((response) => response.statusCode.should.equal(502));
      });
    });
  });
});

