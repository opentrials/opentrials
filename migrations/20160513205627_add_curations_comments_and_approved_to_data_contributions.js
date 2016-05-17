'use strict';

exports.up = (knex) => (
  knex.schema
    .table('data_contributions', (table) => {
      table.boolean('approved')
        .notNullable()
        .defaultTo(false);

      table.text('curation_comments')
        .nullable();
    })
);

exports.down = (knex) => (
  knex.schema
    .table('data_contributions', (table) => {
      table.dropColumns([
        'approved',
        'curation_comments',
      ]);
    })
);
