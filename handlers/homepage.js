'use strict';

const locations = require('../agents/locations');

function homepage(request, reply) {
  locations.list().then((response) => {
    reply.view('index', {
      title: 'OpenTrials.net',
      locations: response,
    });
  });
}

module.exports = homepage;
