'use strict';

require('dotenv').config();

const db = {
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  },
};

module.exports = db;
