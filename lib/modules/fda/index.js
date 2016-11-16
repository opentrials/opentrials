'use strict';

function register(server, options, next) {
  server.route([
    {
      path: '/',
      method: 'GET',
      handler: (request, reply) => {
        return reply.redirect('/search');
      },
    },
    {
      path: '/about',
      method: 'GET',
      config: require('./about'),
    },
    {
      path: '/search',
      method: 'GET',
      config: require('./search'),
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
