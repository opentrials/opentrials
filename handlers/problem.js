'use strict';

const Boom = require('boom');
const problems = require('../agents/problems');

function problemsDetails(request, reply) {
  const problemId = request.params.id;

  problems.get(problemId).then((_problem) => {
    reply.view('problems-details', {
      title: _problem.name,
      problem: _problem,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Problem not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = problemsDetails;
