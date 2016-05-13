'use strict';

const should = require('should');
const server = require('../../../server');
const DataContribution = require('../../../models/data-contribution');


describe('admin data curation handler', () => {
  before(clearDB);

  afterEach(clearDB);

  describe('GET /admin/data-curation', () => {
    it('is successful', () => {
      return server.inject('/admin/data-curation')
        .then((response) => should(response.statusCode).equal(200));
    })

    it('adds the ordered dataContributions and their users into the context', () => {
      let dataContributions;

      return factory.createMany('dataContribution', 2)
        .then(() => new DataContribution()
                      .query('orderBy', 'created_at', 'desc')
                      .fetchAll({ withRelated: ['user'] }))
        .then((_dataContributions) => dataContributions = _dataContributions )
        .then(() => server.inject('/admin/data-curation'))
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.dataContributions).deepEqual(dataContributions.toJSON());
        });
    });
  });
});
