'use strict';

const port = Number(process.env.PORT || 5000);

// Heroku doesn't allow multiple web servers on the same instance, so we need
// to decide who's the main one.
let explorerPort;
let fdaPort;
if (process.env.MAIN_APP === 'fda') {
  explorerPort = port + 1;
  fdaPort = port;
} else {
  explorerPort = port;
  fdaPort = port + 1;
}

const manifest = {
  connections: [
    {
      port: explorerPort,
      labels: ['web'],
    },
    {
      port: fdaPort,
      labels: ['web-fda'],
    },
  ],
  registrations: [
    {
      plugin: {
        register: 'good',
        options: {
          reporters: {
            console: [
              {
                module: 'good-console',
                args: [{
                  log: '*',
                  response: '*',
                  error: '*',
                }],
              },
              'stdout',
            ],
          },
        },
      },
      options: {
        select: ['web', 'web-fda'],
      },
    },
    {
      plugin: {
        register: 'inert',
      },
      options: {
        select: ['web', 'web-fda'],
      },
    },
    {
      plugin: {
        register: 'vision',
      },
      options: {
        select: ['web', 'web-fda'],
      },
    },
    {
      plugin: {
        register: 'hapi-auth-cookie',
      },
      options: {
        select: ['web', 'web-fda'],
      },
    },
    {
      plugin: {
        register: 'bell',
      },
      options: {
        select: ['web', 'web-fda'],
      },
    },
    {
      plugin: {
        register: 'hapi-context-credentials',
      },
      options: {
        select: ['web', 'web-fda'],
      },
    },
    {
      plugin: {
        register: 'yar',
        options: {
          storeBlank: false,
          cookieOptions: {
            password: process.env.SESSION_PASSWORD,
            isSecure: false,  // FIXME: Set to true in production when issue #100 is fixed
          },
        },
      },
      options: {
        select: ['web', 'web-fda'],
      },
    },
  ],
};

// Sentry
const env = process.env.NODE_ENV || 'development';
const sentryDsn = process.env.SENTRY_DSN;
if (sentryDsn && env === 'production') {
  manifest.registrations.push({
    plugin: {
      register: 'hapi-raven',
      options: {
        dsn: sentryDsn,
      },
      tags: [
        env,
      ],
    },
    options: {
      select: ['web', 'web-fda'],
    },
  });
}

// Our modules
manifest.registrations = manifest.registrations.concat([
  {
    plugin: './lib/modules/explorer',
    options: {
      select: ['web'],
    },
  },
  {
    plugin: './lib/modules/fda',
    options: {
      select: ['web-fda'],
    },
  },
]);

module.exports = manifest;
