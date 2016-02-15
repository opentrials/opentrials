const Swagger = require('swagger-client');

module.exports = new Swagger({
  url: process.env.SWAGGER_API_URL || 'http://localhost:10010/v1/swagger.yaml',
  usePromise: true,
});
