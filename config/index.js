require('dotenv').config();

const config = {
  host: process.env.HOST,
  port: process.env.PORT,

  opentrialsApi: require('./opentrials-api'),

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
