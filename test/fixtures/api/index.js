const fs = require('fs');
const path = require('path');
const nock = require('nock');

const swaggerPath = path.join(__dirname, 'swagger.yaml');

module.exports = nock('http://localhost:10010')
  .get('/swagger.yaml')
  .reply(200, fs.readFileSync(swaggerPath, 'utf-8'));
