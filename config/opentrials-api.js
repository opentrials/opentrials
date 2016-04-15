'use strict';

const Swagger = require('swagger-client');
const apiUrl = process.env.OPENTRIALS_API_URL || 'http://localhost:10010/v1';

module.exports = new Swagger({
  url: `${apiUrl}/swagger.yaml`,
  usePromise: true,
});
