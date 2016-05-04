'use strict';

exports.up = (knex) => (
  knex.schema
    .createTable('users', (table) => {
      table.uuid('id')
        .primary();
      table.string('email')
        .notNullable()
        .unique()
        .index();
      table.string('name')
        .notNullable();
      table.timestamps();
    })
    .createTable('oauth_credentials', (table) => {
      table.string('provider')
        .notNullable();
      table.string('id')
        .notNullable();
      table.uuid('user_id')
        .notNullable()
        .references('users.id');

      table.unique(['provider', 'id', 'user_id']);
    })
);

exports.down = (knex) => (
  knex.schema
    .dropTableIfExists('oauth_credentials')
    .dropTableIfExists('users')
);
