'use strict';

const url = require('url');
const config = require('../../config');
const routes = require('../../routes');

function register(server, options, next) {
  _configureAuth(server);

  server.route(routes);

  next();
}

register.attributes = {
  name: 'explorer',
  version: '1.0.0',
};

function _configureAuth(server) {
  const baseConfiguration = {
    password: config.hapi.auth.cookie.password,
    isSecure: false,  // FIXME: Set to true in production when issue #100 is fixed
    domain: url.parse(config.url).hostname,
  };

  server.auth.strategy('session', 'cookie', baseConfiguration);

  server.auth.strategy('google', 'bell', Object.assign(
    {},
    baseConfiguration,
    {
      provider: 'google',
      clientId: config.hapi.auth.google.clientId,
      clientSecret: config.hapi.auth.google.clientSecret,
    }
  ));

  server.auth.strategy('facebook', 'bell', Object.assign(
    {},
    baseConfiguration,
    {
      provider: 'facebook',
      clientId: config.hapi.auth.facebook.clientId,
      clientSecret: config.hapi.auth.facebook.clientSecret,
    }
  ));

  server.auth.default({
    strategy: 'session',
    mode: 'optional',
  });
}

module.exports = {
  register,
};
