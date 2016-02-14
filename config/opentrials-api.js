const Swagger = require('swagger-client');

module.exports = new Swagger({
  url: process.env.SWAGGER_API_URL,
  usePromise: true,
});
