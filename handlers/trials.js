'use strict';

const Boom = require('boom');
const trials = require('../agents/trials');

function getTrial(request, reply) {
  const trialId = request.params.id;

  trials.get(trialId).then((_trial) => {
    reply.view('trials-details', {
      title: _trial.public_title,
      trial: _trial,
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

module.exports = {
  getTrial,
  getRecord,
};
