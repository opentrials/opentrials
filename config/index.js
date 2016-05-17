'use strict';

const path = require('path');
require('dotenv').config();

const config = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 5000,
  url: process.env.URL,

  opentrialsApi: require('./opentrials-api'),

  hapi: {
    plugins: [
      {
        register: require('good'),
        options: {
          reporters: [
            {
              reporter: require('good-console'),
              events: { log: '*', response: '*' },
            },
          ],
        },
      },
      {
        register: require('inert'),
      },
      {
        register: require('vision'),
      },
      {
        register: require('hapi-auth-cookie'),
      },
      {
        register: require('bell'),
      },
      {
        register: require('hapi-context-credentials'),
      },
      {
        register: require('yar'),
        options: {
          storeBlank: false,
          cookieOptions: {
            password: process.env.SESSION_PASSWORD,
            isSecure: false,  // FIXME: Set to true in production when issue #100 is fixed
          },
        },
      },
    ],

    views: require('./nunjuck'),

    auth: {
      cookie: {
        password: process.env.SESSION_PASSWORD,
      },

      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },

      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      },
    },
  },

  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
    maxUploadSize: process.env.MAX_UPLOAD_SIZE,
    customDomain: process.env.S3_CUSTOM_DOMAIN,
  },
};

const env = process.env.NODE_ENV || 'development';
const knexConfig = require(path.join(__dirname, '..', './knexfile'))[env];
const knex = require('knex')(knexConfig);
config.bookshelf = require('bookshelf')(knex);
config.bookshelf.plugin('registry');
config.bookshelf.plugin('virtuals');

module.exports = config;
