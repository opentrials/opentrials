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

  describe('POST /admin/data-curation/{id}', () => {
    it('updates the DataContribution and redirects to /admin/data-curation', () => {
      const payload = {
        approved: true,
        curation_comments: 'My comments',
      }
      let dataContributionId;

      return factory.create('dataContribution')
        .then((dataContribution) => dataContributionId = dataContribution.attributes.id)
        .then(() => server.inject({
          url: `/admin/data-curation/${dataContributionId}`,
          method: 'post',
          payload,
        }))
        .then((response) => {
          should(response.statusCode).equal(302);
          should(response.headers.location).equal('/admin/data-curation');
          should(response.request.yar.flash('success')).not.be.empty();
        })
        .then(() => new DataContribution({ id: dataContributionId }).fetch({ require: true }))
        .then((dataContribution) => should(dataContribution.toJSON()).containDeep(payload));
    });

    it('displays error message if there was any error', () => {
      const options = {
        url: `/admin/data-curation/08773510-532c-4b14-8a66-566bd1a82403`,
        method: 'post',
        payload: {
          approved: true,
          curation_comments: 'My comments',
        },
      }

      return server.inject(options)
        .then((response) => {
          should(response.statusCode).equal(302);
          should(response.headers.location).equal('/admin/data-curation');
          should(response.request.yar.flash('error')).not.be.empty();
        });
    });
  });
});
