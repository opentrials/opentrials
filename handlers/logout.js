'use strict';

function logout(request, reply) {
  request.cookieAuth.clear();

  let redirectToPage = request.headers.referer;
  if (!redirectToPage) {
    redirectToPage = '/';
  }
  reply.redirect(redirectToPage);
}

module.exports = {
  handler: logout,
};
