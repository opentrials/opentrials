'use strict';

function homepage(request, reply) {
  reply.view('index', {
    title: 'OpenTrials.net',
  });
}

module.exports = homepage;
