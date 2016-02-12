const Swagger = require('swagger-client');

module.exports = new Swagger({
  url: 'http://localhost:10010/swagger.yaml',
  usePromise: true,
});
