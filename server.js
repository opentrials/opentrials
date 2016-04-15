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
  .then(() => (server.views(config.hapi.views)))
  .then(() => (server.route(routes)))
  .then(() => {
    server.start(() => {
      console.info('Server started at', server.info.uri); // eslint-disable-line no-console
    });
  });

module.exports = server;
