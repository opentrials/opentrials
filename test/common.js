'use strict';

process.env.NODE_ENV = 'test';

require('dotenv').config();
const _ = require('lodash');
const nock = require('nock');
const apiServer = require('./fixtures/api');
const fixtures = require('./fixtures');
const factory = require('./factory');
const config = require('../config');

function clearDB() {
  const tables = [
    'data_contributions',
    'data_categories',
    'oauth_credentials',
    'users',
  ];
  let deferred = config.bookshelf.knex.migrate.latest();

  for (const tableName of tables) {
    // eslint-disable-next-line no-loop-func
    deferred = deferred.then(() => config.bookshelf.knex(tableName).select().del());
  }

  return deferred;
}

function mockApiResponses(responses) {
  // When "responses" is undefined, mocks all API responses
  const defaultResponses = {
    search: {
      response: { total_count: 0, items: [] },
      statusCode: 200,
    },
  };
  const theResponses = _.merge({}, defaultResponses, responses);
  if (theResponses.search.query && theResponses.search.query.per_page === undefined) {
    theResponses.search.query.per_page = 10;
  }

  for (const endpoint of Object.keys(defaultResponses)) {
    const endpointResponse = theResponses[endpoint];
    let query = endpointResponse.query;
    if (query) {
      query = _.omitBy(query, _.isUndefined);
    } else {
      // Ignore query values
      query = true;
    }

    apiServer.get(`/${endpoint}`)
      .query(query)
      .reply(endpointResponse.statusCode, endpointResponse.response);
  }
}

function getExplorerServer() {
  const serverPromise = require('../server'); // eslint-disable-line global-require

  return serverPromise
    .then((server) => server.select('web'));
}


global.clearDB = clearDB;
global.apiServer = apiServer;
global.fixtures = fixtures;
global.factory = factory;
global.mockApiResponses = mockApiResponses;
global.cleanAllApiMocks = nock.cleanAll;
global.getExplorerServer = getExplorerServer;
