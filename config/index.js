'use strict';

const path = require('path');
require('dotenv').config();

const config = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 5000,

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
    ],

    views: require('./nunjuck'),

    auth: {
      cookie: {
        password: process.env.SESSION_PASSWORD,
      },

      google: {
        password: process.env.SESSION_PASSWORD,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  },
};

const env = process.env.NODE_ENV || 'development';
const knexConfig = require(path.join(__dirname, '..', './knexfile'))[env];
const knex = require('knex')(knexConfig);
config.bookshelf = require('bookshelf')(knex);
config.bookshelf.plugin('registry');

module.exports = config;
