/* eslint-disable global-require */

'use strict';

const path = require('path');
require('dotenv').config();

const config = {
  url: process.env.URL,

  opentrialsApi: require('./opentrials-api'),

  hapi: {
    manifest: require('./glue'),

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

  smtp: {
    host: process.env.SMTP_HOST,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    ssl: true,
  },

  dataContributionEmailTo: process.env.DATA_CONTRIBUTION_EMAIL_TO,
  dataContributionEmailFrom: process.env.DATA_CONTRIBUTION_EMAIL_FROM,
};

const env = process.env.NODE_ENV || 'development';
const knexConfig = require(path.join(__dirname, '..', './knexfile'))[env];  // eslint-disable-line import/no-dynamic-require
const knex = require('knex')(knexConfig);
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');
bookshelf.plugin('virtuals');
config.bookshelf = bookshelf;

module.exports = config;
