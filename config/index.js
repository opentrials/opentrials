require('dotenv').config();

const config = {
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 5000,

  opentrialsApi: require('./opentrials-api'),

  hapi: {
    plugins: [{
      register: require('good'),
      options: {
        reporters: [{
          reporter: require('good-console'),
          events: { log: '*', response: '*' },
        }],
      },
    }, {
      register: require('inert'),
    }, {
      register: require('vision'),
    }],

    views: require('./nunjuck'),
  },
};

module.exports = config;
