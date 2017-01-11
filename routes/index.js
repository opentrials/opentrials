/* eslint-disable global-require */

'use strict';

const routes = [
  {
    path: '/',
    method: 'GET',
    config: require('../handlers/homepage'),
  },
  {
    path: '/about',
    method: 'GET',
    config: require('../handlers/about'),
  },
  {
    path: '/terms-of-use',
    method: 'GET',
    config: require('../handlers/terms-of-use'),
  },
  {
    path: '/trials/{id}',
    method: 'GET',
    config: require('../handlers/trials').trial,
  },
  {
    path: '/trials/{id}/discrepancies',
    method: 'GET',
    config: require('../handlers/trials').discrepancies,
  },
  {
    path: '/search',
    method: 'GET',
    config: require('../handlers/search'),
  },
  {
    path: '/conditions/{id}',
    method: 'GET',
    config: require('../handlers/condition'),
  },
  {
    path: '/interventions/{id}',
    method: 'GET',
    config: require('../handlers/intervention'),
  },
  {
    path: '/persons/{id}',
    method: 'GET',
    config: require('../handlers/person'),
  },
  {
    path: '/organisations/{id}',
    method: 'GET',
    config: require('../handlers/organisation'),
  },
  {
    path: '/publications/{id}',
    method: 'GET',
    config: require('../handlers/publication'),
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
    config: require('../handlers/logout'),
  },
  {
    path: '/contribute-data',
    method: 'GET',
    config: require('../handlers/contribute-data').get,
  },
  {
    path: '/contribute-data',
    method: 'POST',
    config: require('../handlers/contribute-data').post,
  },
  {
    path: '/admin/data-contributions',
    method: 'GET',
    config: require('../handlers/admin/data-contributions').get,
  },
  {
    path: '/admin/data-contributions/{id}',
    method: 'POST',
    config: require('../handlers/admin/data-contributions').post,
  },
  {
    path: '/takedown',
    method: 'GET',
    config: require('../handlers/takedown'),
  },
  {
    path: '/flag-error',
    method: 'GET',
    config: require('../handlers/flag-error'),
  },
  {
    path: '/stats',
    method: 'GET',
    config: require('../handlers/stats'),
  },
];

module.exports = routes;
