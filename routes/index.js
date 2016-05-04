'use strict';

const searchHandler = require('../handlers/search');

const routes = [
  {
    path: '/assets/{param*}',
    method: 'GET',
    handler: {
      directory: {
        path: './dist',
      },
    },
    config: {
      cache: {
        expiresIn: 7 * 24 * 60 * 60 * 1000,
      },
    },
  },
  {
    path: '/',
    method: 'GET',
    handler: require('../handlers/homepage'),
  },
  {
    path: '/about',
    method: 'GET',
    handler: require('../handlers/about'),
  },
  {
    path: '/trials/{id}',
    method: 'GET',
    handler: require('../handlers/trials').getTrial,
  },
  {
    path: '/trials/{trialId}/records/{id}',
    method: 'GET',
    handler: require('../handlers/trials').getRecord,
  },
  {
    path: '/search',
    method: 'GET',
    handler: searchHandler.handler,
    config: searchHandler.config,
  },
  {
    path: '/problems/{id}',
    method: 'GET',
    handler: require('../handlers/problem'),
  },
  {
    path: '/interventions/{id}',
    method: 'GET',
    handler: require('../handlers/intervention'),
  },
  {
    path: '/persons/{id}',
    method: 'GET',
    handler: require('../handlers/person'),
  },
  {
    path: '/organisations/{id}',
    method: 'GET',
    handler: require('../handlers/organisation'),
  },
  {
    path: '/login/google',
    method: 'GET',
    config: require('../handlers/login').google,
  },
  {
    path: '/login/facebook',
    method: 'GET',
    config: require('../handlers/login').facebook,
  },
  {
    path: '/logout',
    method: 'GET',
    handler: require('../handlers/logout'),
  },
];

module.exports = routes;
