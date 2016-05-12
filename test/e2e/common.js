'use strict';

const url = require('url');
const assert = require('assert');


function getServerUrl() {
  // This can't be run automatically because running our default test suite
  // runs this file as well. Mocha only allows "grepping" inside the test suite
  // names. As there's no test suite inside this file, we can't avoid Mocha
  // from running it. This might change if Mocha's PR #1445 ever gets merged.
  const serverUrl = process.env.OPENTRIALS_URL;

  assert(serverUrl, 'OPENTRIALS_URL must define the server\'s URL.');

  return url.parse(serverUrl).href;
}

global.getServerUrl = getServerUrl;
