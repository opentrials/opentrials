'use strict';

const Boom = require('boom');
const publications = require('../agents/publications');

function publicationsDetails(request, reply) {
  const publicationId = request.params.id;

  publications.get(publicationId).then((_publication) => {
    reply.view('publications-details', {
      title: _publication.title,
      publication: _publication,
    });
  }).catch((err) => {
    if (err.status === 404) {
      reply(Boom.notFound('Publication not found.', err));
    } else {
      reply(Boom.badGateway('Error accessing OpenTrials API.', err));
    }
  });
}

module.exports = {
  handler: publicationsDetails,
};
