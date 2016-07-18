'use strict';

function addFlashMessagesToContext(request, reply) {
  const response = request.response;

  if (request.yar.flash && response.variety === 'view') {
    response.source.context = Object.assign(
      {},
      response.source.context || {},
      { flash: request.yar.flash() }
    );
  }

  return reply.continue();
}

module.exports = addFlashMessagesToContext;
