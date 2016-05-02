'use strict';

function logout(request, reply) {
  request.cookieAuth.clear();
  reply.redirect('/');
}

module.exports = logout;
