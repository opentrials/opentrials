'use strict';

process.env.NODE_ENV = 'test';

require('dotenv').config();
const _ = require('lodash');
const nock = require('nock');
const apiServer = require('./fixtures/api');
const fixtures = require('./fixtures');
const config = require('../config');

function clearDB() {
  const tables = [
    'data_contributions',
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
  const defaultResponses = {
    search: {
      query: {
        per_page: 10,
      },
      response: { total_count: 0, items: [] },
      statusCode: 200,
    },
  };
  const theResponses = _.merge({}, defaultResponses, responses);

  for (const endpoint of Object.keys(defaultResponses)) {
    const endpointResponse = theResponses[endpoint];

    apiServer.get(`/${endpoint}`)
      .query(endpointResponse.query)
      .reply(endpointResponse.statusCode, endpointResponse.response);
  }
}

global.clearDB = clearDB;
global.apiServer = apiServer;
global.fixtures = fixtures;
global.factory = require('./factory');
global.mockApiResponses = mockApiResponses;
global.cleanAllApiMocks = nock.cleanAll;
