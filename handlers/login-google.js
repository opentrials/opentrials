'use strict';

const Boom = require('boom');
const User = require('../models/user');

function login(request, reply) {
  if (!request.auth.isAuthenticated) {
    reply(Boom.badRequest(`Auth failed: ${request.auth.error.message}`));
  } else {
    const credentials = request.auth.credentials;
    const profile = credentials.profile;
    const userAttrs = {
      name: profile.displayName,
      email: profile.emails[0].value,  // Ignore multiple emails for now
    };

    new User().findOrCreateByEmail(userAttrs, credentials.provider, profile.id)
      .then((user) => {
        request.cookieAuth.set(user);
        reply.redirect('/');
      });
  }
}

module.exports = {
  handler: login,
  auth: {
    strategy: 'google',
    mode: 'try',
  },
};
