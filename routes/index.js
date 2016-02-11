const routes = [
  {
    path: '/',
    method: 'GET',
    handler: require('../handlers/homepage'),
  },
  {
    path: '/static/{param*}',
    method: 'GET',
    handler: {
      directory: {
        path: './dist',
      },
    },
  },
];

module.exports = routes;
