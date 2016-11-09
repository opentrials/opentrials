'use strict';

function register(server, options, next) {
  server.route([
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
