'use strict';

function sendErrorsToSentry(hapiRaven) {
  return (request, reply) => {
    const response = request.response;

    if (hapiRaven && response.isBoom) {
      const statusCode = response.output.payload.statusCode;

      if (statusCode >= 500) {
        hapiRaven.client.captureError(response);
      }
    }

    return reply.continue();
  };
}

module.exports = sendErrorsToSentry;
