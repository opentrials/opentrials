'use strict';

const Boom = require('boom');
const trials = require('../agents/trials');

function getTrial(request, reply) {
  const trialId = request.params.id;

  trials.get(trialId).then((trial) => {
    reply.view('trials-details', {
      title: trial.public_title,
      trial,
      contributeDataUrl: `/contribute-data?trial_id=${trial.id}&redirectTo=/trials/${trial.id}`,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Trial not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

function getDiscrepancies(request, reply) {
  const id = request.params.id;

  trials.get(id).then((trial) => {
    reply.view('trial-discrepancies', {
      title: 'Discrepancies',
      trial,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Trial not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = {
  trial: {
    handler: getTrial,
  },
  discrepancies: {
    handler: getDiscrepancies,
  },
};
