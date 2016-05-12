'use strict';

function _getServerUrl() {
  const url = require('url');

  let serverUrl = process.env.OPENTRIALS_URL;

  if (!serverUrl) {
    const server = require('../../server');
    serverUrl = server.info.uri;
  }

  return url.parse(serverUrl).href;
}

global.SERVER_URL = _getServerUrl();
