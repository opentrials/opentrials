'use strict';

const uuid = require('node-uuid');
const Boom = require('boom');
const User = require('../models/user');

function login(request, reply) {
  if (!request.auth.isAuthenticated) {
    reply(Boom.badRequest(`Auth failed: ${request.auth.error.message}`));
  } else {
    const credentials = request.auth.credentials;
    const profile = credentials.profile;
    const email = profile.emails[0].value;  // Ignore multiple emails for now

    new User().findByEmailOrOAuth(email, credentials.provider, profile.id).fetch()
      .then((user) => {
        let theUser = user;

        if (theUser === null) {
          theUser = new User({
            id: uuid.v1(),
            name: profile.displayName,
            email,
          }).save(null, { method: 'insert' });
        }

        return theUser;
      }).then((user) => {
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
