const trials = require('../agents/trials');

function homepage(request, reply) {
  trials.list().then((_trials) => {
    reply.view('index', {
      title: 'OpenTrials.net',
      trials: _trials,
    });
  });
}

module.exports = homepage;
