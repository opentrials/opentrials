'use strict';

exports.up = (knex) => (
  knex.schema
    .createTable('data_contributions', (table) => {
      table.uuid('id')
        .primary();
      table.uuid('user_id')
        .references('users.id')
        .nullable();
      table.uuid('trial_id')
        .nullable();
      table.string('url')
        .notNullable()
        .unique();
      table.text('comments')
        .nullable();
      table.timestamps();
    })
);

exports.down = (knex) => (
  knex.schema
    .dropTableIfExists('data_contributions')
);
