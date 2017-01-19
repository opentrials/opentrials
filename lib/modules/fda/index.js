/* eslint-disable global-require */

'use strict';

function register(server, options, next) {
  server.route([
    {
      path: '/',
      method: 'GET',
      handler: (request, reply) => reply.redirect('/search'),
    },
    {
      path: '/search',
      method: 'GET',
      config: require('./search'),
    },
    {
      path: '/about',
      method: 'GET',
      config: require('./about'),
    },
    {
      path: '/faq',
      method: 'GET',
      config: require('./faq'),
    },
  ]);

  next();
}

register.attributes = {
  name: 'fda',
  version: '1.0.0',
};


module.exports = {
  register,
};
