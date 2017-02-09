'use strict';

exports.up = (knex) => (
  knex.schema.table('data_contributions', (table) =>
    table.uuid('document_id')
  )
);

exports.down = (knex) => (
  knex.schema.table('data_contributions').dropColumn('document_id')
);
