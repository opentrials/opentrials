'use strict';

function takedown(request, reply) {
  let redirectTo = 'https://docs.google.com/forms/d/e/1FAIpQLSew2Rsu5EY-SYODFzZCh2wMWKcbcJe5CQlMFoyH8shmIE1jfQ/viewform';

  const url = request.query.url;
  if (url) {
    redirectTo += `?entry.579116872=${url}`;
  }

  return reply.redirect(redirectTo);
}

module.exports = {
  handler: takedown,
};
