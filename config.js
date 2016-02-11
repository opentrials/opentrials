const path = require('path');
const config = {
  port: process.env.PORT || 3000,

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

    views: {
      engines: {
        html: require('nunjucks-hapi'),
      },
      path: path.join(__dirname, 'views'),
    },
  },
};

module.exports = config;
