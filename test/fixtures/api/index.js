'use strict';

const fs = require('fs');
const path = require('path');
const nock = require('nock');

const apiUrl = process.env.OPENTRIALS_API_URL || 'http://localhost:10010/v1';
const swaggerApiUrl = `${apiUrl}/swagger.yaml`;
const url = swaggerApiUrl.slice(0, swaggerApiUrl.length - 'swagger.yaml'.length);
const swaggerPath = path.join(__dirname, 'swagger.yaml');

module.exports = nock(url)
  .get('/swagger.yaml')
  .reply(200, fs.readFileSync(swaggerPath, 'utf-8'));
