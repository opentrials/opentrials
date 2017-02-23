'use strict';

const should = require('should');
const DataContribution = require('../../../models/data-contribution');

const categories = JSON.parse(JSON.stringify(
  fixtures.listDocumentCategories()
));
let server;

describe('admin data contributions handler', () => {
  before(() => (
    clearDB()
      .then(() => getExplorerServer())
      .then((_server) => (server = _server))
  ));

  afterEach(clearDB);

  describe('GET /admin/data-contributions', () => {
    let response;

    before(() => {
      apiServer.get('/document_categories').reply(200, categories);
      return server.inject('/admin/data-contributions')
        .then((_response) => {
          response = _response;
        });
    });

    it('requires a logged in user', () => should(response.statusCode).equal(401));

    _itReturnsStatusCodeForRoles(200, ['admin', 'curator'], {
      url: '/admin/data-contributions',
      method: 'GET',
    });

    _itReturnsStatusCodeForRoles(403, [undefined], {
      url: '/admin/data-contributions',
      method: 'GET',
    });

    it('adds the ordered dataContributions and their users into the context', () => {
      const options = {
        url: '/admin/data-contributions',
        method: 'GET',
        credentials: factory.buildSync('admin').toJSON(),
      };
      let dataContributions;

      return factory.createMany('dataContribution', 2)
        .then(() => new DataContribution()
                      .query('orderBy', 'created_at', 'desc')
                      .fetchAll({ withRelated: DataContribution.relatedModels }))
        .then((_dataContributions) => (dataContributions = _dataContributions))
        .then(() => server.inject(options))
        .then((_response) => {
          const context = _response.request.response.source.context;
          should(context.dataContributions).deepEqual(dataContributions.toJSON());
        });
    });
  });

  describe('POST /admin/data-contributions/{id}', () => {
    it('requires a logged in user', () => {
      const options = {
        url: '/admin/data-contributions/00000000-0000-0000-0000-000000000000',
        method: 'POST',
        payload: {},
      };

      return server.inject(options)
        .then((_response) => should(_response.statusCode).equal(401));
    });

    _itReturnsStatusCodeForRoles(302, ['admin', 'curator'], {
      url: '/admin/data-contributions/00000000-0000-0000-0000-000000000000',
      method: 'POST',
      payload: {},
    });

    _itReturnsStatusCodeForRoles(403, [undefined], {
      url: '/admin/data-contributions/00000000-0000-0000-0000-000000000000',
      method: 'POST',
      payload: {},
    });

    it('updates the DataContribution and redirects to /admin/data-contributions', () => {
      const payload = {
        approved: true,
        trial_id: '11111111-1111-1111-1111-111111111111',
        document_category_id: 20,
        curation_comments: 'My comments',
      };
      let dataContributionId;

      return factory.create('dataContribution')
        .then((dataContribution) => (dataContributionId = dataContribution.attributes.id))
        .then(() => server.inject({
          url: `/admin/data-contributions/${dataContributionId}`,
          method: 'POST',
          credentials: factory.buildSync('admin').toJSON(),
          payload,
        }))
        .then((_response) => {
          should(_response.statusCode).equal(302);
          should(_response.headers.location).equal('/admin/data-contributions');
          should(_response.request.yar.flash('success')).not.be.empty();
        })
        .then(() => new DataContribution({ id: dataContributionId }).fetch({ require: true }))
        .then((dataContribution) => should(dataContribution.toJSON()).containDeep(payload));
    });

    it('displays error message if there was any error', () => {
      const options = {
        url: '/admin/data-contributions/00000000-0000-0000-0000-000000000000',
        method: 'POST',
        credentials: factory.buildSync('admin').toJSON(),
        payload: {},
      };

      return server.inject(options)
        .then((_response) => {
          should(_response.statusCode).equal(302);
          should(_response.headers.location).equal('/admin/data-contributions');
          should(_response.request.yar.flash('error')).not.be.empty();
        });
    });
  });
});


function _itReturnsStatusCodeForRoles(statusCode, roles, options) {
  roles.forEach((role) => {
    it(`returns status code ${statusCode} for users with role ${role}`, () => {
      const user = factory.buildSync('user', { role });
      const optionsWithCredentials = Object.assign(
        { credentials: user.toJSON() },
        options
      );

      apiServer.get('/document_categories').reply(200, categories);
      return server.inject(optionsWithCredentials)
        .then((_response) => should(_response.statusCode).equal(statusCode));
    });
  });
}
