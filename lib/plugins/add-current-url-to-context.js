'use strict';

function addCurrentURLToContext(request, reply) {
  const response = request.response;
  const currentURL = `${request.headers['x-forwarded-proto'] || request.connection.info.protocol}://${request.info.host}${request.url.path}`;

  if (response.variety === 'view') {
    response.source.context = Object.assign(
      {},
      response.source.context || {},
      { currentURL }
    );
  }

  return reply.continue();
}

module.exports = addCurrentURLToContext;
