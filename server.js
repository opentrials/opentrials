'use strict';

const Hapi = require('hapi');
const url = require('url');
const plugins = require('./lib/plugins');
const config = require('./config');
const routes = require('./routes');
const server = new Hapi.Server();

server.connection({
  host: config.host,
  port: config.port,
});

server.ext('onPreResponse', plugins.addFlashMessagesToContext);
server.ext('onPreResponse', plugins.httpErrorHandler);
server.ext('onPreResponse', plugins.addCurrentURLToContext);

server.register(config.hapi.plugins)
  .then(() => {
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
  })
  .then(() => server.views(config.hapi.views))
  .then(() => server.route(routes))
  .then(() => {
    server.start(() => {
      console.info('Server started at', server.info.uri); // eslint-disable-line no-console
    });
  });


module.exports = server;
