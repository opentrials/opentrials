'use strict';

const Glue = require('glue');
const Promise = require('bluebird');
const config = require('./config');
const plugins = require('./lib/plugins');

const options = {
  relativeTo: __dirname,
};

// istanbul ignore next
function startOrInitializeServer(resolve, reject) {
  Promise.promisify(Glue.compose)(config.hapi.manifest, options)
    .then((server) => {
      server.route([
        {
          path: '/assets/{param*}',
          method: 'GET',
          handler: {
            directory: {
              path: './dist',
            },
          },
          config: {
            cache: {
              expiresIn: 7 * 24 * 60 * 60 * 1000,
            },
          },
        },
      ]);

      const hapiRaven = server.plugins['hapi-raven'];
      server.ext('onPreResponse', plugins.sendErrorsToSentry(hapiRaven));
      server.ext('onPreResponse', plugins.addFlashMessagesToContext);
      server.ext('onPreResponse', plugins.addCurrentURLToContext);
      server.ext('onPreResponse', plugins.httpErrorHandler);

      server.views(config.hapi.views);

      return server.initialize()
        .then(() => {
          const isFileBeingRequired = (module.parent);
          if (!isFileBeingRequired) {
            return server.start()
              .then(() => {
                server.connections.forEach((conn) => {
                  console.info('Server started', conn.info.uri, conn.settings.labels); // eslint-disable-line no-console
                });
              })
              .then(() => server);
          }
          return server;
        });
    })
    .then(resolve)
    .catch((err) => {
      reject(err);
      console.error(err.stack); // eslint-disable-line no-console
      process.exit(1);
    });
}

module.exports = new Promise(startOrInitializeServer);
