'use strict';

const config = {
  port: process.env.PORT || 5000,

  hapi: {
    plugins: [{
      register: require('good'),
      options: {
        reporters: [{
          reporter: require('good-console'),
          events: { log: '*', reponse: '*' },
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
