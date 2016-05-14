'use strict';

exports.up = (knex) => (
  knex.schema
    .table('users', (table) => {
      table.enu('role', [
        'curator',
        'admin',
      ]).nullable();
    })
);

exports.down = (knex) => (
  knex.schema
    .table('users', (table) => {
      table.dropColumn('role');
    })
);
