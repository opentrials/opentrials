const Hapi = require('hapi');
const vision = require('vision');
const config = require('./config');
const routes = require('./routes');
const server = new Hapi.Server();

server.connection({
  port: config.port,
});

server.register(vision, (err) => {
  if (err) { throw err; }

  server.views(config.hapi.views);
});

server.route(routes);

server.register(config.hapi.plugins, (err) => {
  if (err) { throw err; }

  server.start(() => {
    console.info('Server started at', server.info.uri); // eslint-disable-line no-console
  });
});
