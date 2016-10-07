'use strict';

function getStats(request, reply) {
  reply.view('stats', {
    title: 'Statistics',
  });
}

module.exports = {
  handler: getStats,
};

