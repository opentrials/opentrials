'use strict';
require('dotenv').config();
const _ = require('lodash');
const nock = require('nock');
const apiServer = require('./fixtures/api');
const fixtures = require('./fixtures');

function mockApiResponses(responses) {
  const defaultResponses = {
    search: {
      query: {
        per_page: 10,
      },
      response: { total_count: 0, items: [] },
      statusCode: 200,
    },
    locations: {
      query: {},
      response: [],
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

global.apiServer = apiServer;
global.fixtures = fixtures;
global.mockApiResponses = mockApiResponses;
global.cleanAllApiMocks = nock.cleanAll;
