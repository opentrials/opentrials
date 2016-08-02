'use strict';
const Boom = require('boom');
const stats = require('../agents/stats');

function getStats(request, reply) {
  stats.get().then((_stats) => {
    reply.view('stats', {
      title: 'Statistics',
      stats: _stats,
    });
  }).catch((err) => {
    reply(Boom.badGateway('Error accessing OpenTrials API.', err));
  });
}

module.exports = {
  handler: getStats,
};
