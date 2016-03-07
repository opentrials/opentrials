const trials = require('../agents/trials');

function trialsDetails(request, reply) {
  const trialId = request.params.id;

  trials.get(trialId).then((_trial) => {
    reply.view('trials-details', {
      title: _trial.public_title,
      trial: _trial,
    });
  }).catch((err) => {
    reply('Trial not found.').code(err.status);
  });
}

module.exports = trialsDetails;
