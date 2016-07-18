'use strict';

function httpErrorHandler(request, reply) {
  const response = request.response;
  if (response.isBoom) {
    const statusCode = response.output.payload.statusCode;
    const errorTitle = response.output.payload.error;
    let errorMessage = response.output.payload.message;

    switch (statusCode) {
      case 404:
        errorMessage = 'Sorry, that page is not available.';
        break;
      default:
        break;
    }

    return reply.view('error', {
      title: `Error ${statusCode}`,
      errorTitle,
      statusCode,
      errorMessage,
    }).code(statusCode);
  }

  return reply.continue();
}

module.exports = httpErrorHandler;
