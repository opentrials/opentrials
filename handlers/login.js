'use strict';

const Boom = require('boom');
const User = require('../models/user');

const profileParsers = {
  google: (profile) => (
    {
      name: profile.displayName,
      email: profile.emails[0].value,  // Ignore multiple emails for now
    }
  ),
  facebook: (profile) => (
    {
      name: profile.displayName,
      email: profile.email,
    }
  ),
};

function generateHandler(parseProfile) {
  return function login(request, reply) {
    if (!request.auth.isAuthenticated) {
      reply(Boom.badRequest(`Auth failed: ${request.auth.error.message}`));
    } else {
      const credentials = request.auth.credentials;
      const userAttrs = parseProfile(credentials.profile);

      new User().findOrCreateByEmail(userAttrs, credentials.provider, credentials.profile.id)
        .then((user) => {
          request.cookieAuth.set(user);
          reply.redirect('/');
        });
    }
  };
}

module.exports = {
  google: {
    handler: generateHandler(profileParsers.google),
    auth: {
      strategy: 'google',
      mode: 'try',
    },
  },
  facebook: {
    handler: generateHandler(profileParsers.facebook),
    auth: {
      strategy: 'facebook',
      mode: 'try',
    },
  },
};
