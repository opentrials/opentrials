'use strict';

const Boom = require('boom');
const trials = require('../agents/trials');

function getTrial(request, reply) {
  const trialId = request.params.id;

  trials.get(trialId).then((trial) => {
    const identifiers = trial.identifiers || {};
    const primaryId = identifiers[trial.primary_source_id];
    const secondaryIds = Object.assign({}, identifiers);
    delete secondaryIds[trial.primary_source_id];

    reply.view('trials-details', {
      title: trial.public_title,
      trial,
      contributeDataUrl: `/contribute-data?trial_id=${trial.id}&redirectTo=/trials/${trial.id}`,
      primaryId,
      secondaryIds,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Trial not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

function getRecord(request, reply) {
  const trialId = request.params.trialId;
  const id = request.params.id;

  trials.getRecord(id, trialId).then((record) => {
    reply.view('trial-record', {
      title: record.public_title,
      record,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Trial record not found.', err));
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
  record: {
    handler: getRecord,
  },
  discrepancies: {
    handler: getDiscrepancies,
  },
};
