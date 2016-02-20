const trials = require('../agents/trials');

function trialsDetails(request, reply) {
  const trialId = request.params.id;

  trials.get(trialId).then((_trial) => {
    reply.view('trials-details', {
      title: _trial.public_title,
      trial: _trial,
    });
  });
}

function trialsList(request, reply) {
  trials.list().then((_trials) => {
    reply.view('trials-list', {
      title: 'Trials',
      trials: _trials,
    });
  });
}

function handler(request, reply) {
  if (request.params.id) {
    trialsDetails(request, reply);
  } else {
    trialsList(request, reply);
  }
}

module.exports = handler;
