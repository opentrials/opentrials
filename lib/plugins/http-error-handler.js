'use strict';

function httpErrorHandler(request, reply) {
  const response = request.response;

  if (response.isBoom) {
    const statusCode = response.output.payload.statusCode;
    const errorReason = response.output.payload.error;
    let errorMessage;

    switch (statusCode) {
      case 404:
        errorMessage = 'Sorry, that page is not available.';
        break;
      default:
        errorMessage = response.output.payload.message;
        break;
    }

    return reply.view('error', {
      title: `Error ${statusCode}: ${errorReason}`,
      statusCode,
      errorMessage,
    }).code(statusCode);
  }

  return reply.continue();
}

module.exports = httpErrorHandler;
