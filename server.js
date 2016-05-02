'use strict';

const Hapi = require('hapi');
const config = require('./config');
const routes = require('./routes');
const server = new Hapi.Server();

server.connection({
  host: config.host,
  port: config.port,
});

server.register(config.hapi.plugins)
  .then(() => {
    server.auth.strategy('session', 'cookie', {
      password: config.hapi.auth.cookie.password,
      isSecure: false,
    });

    server.auth.strategy('google', 'bell', {
      provider: 'google',
      password: config.hapi.auth.google.password,
      clientId: config.hapi.auth.google.clientId,
      clientSecret: config.hapi.auth.google.clientSecret,
      isSecure: false,
      location: server.info.uri,
    });

    server.auth.default({
      strategy: 'session',
      mode: 'optional',
    });
  })
  .then(() => server.views(config.hapi.views))
  .then(() => server.route(routes))
  .then(() => {
    server.start(() => {
      console.info('Server started at', server.info.uri); // eslint-disable-line no-console
    });
  });

module.exports = server;
