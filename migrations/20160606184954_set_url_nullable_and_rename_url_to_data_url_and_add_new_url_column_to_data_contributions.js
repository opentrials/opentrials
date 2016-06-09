'use strict';

exports.up = (knex) => (
  knex.schema
    .table('data_contributions', (table) => {
      table.renameColumn('url', 'data_url');
    })
    .table('data_contributions', (table) => {
      // Had to add this separatedly to make sure the order of execution is
      // respected.
      table.string('url')
        .nullable();
    })
    .raw('ALTER TABLE data_contributions ALTER COLUMN data_url DROP NOT NULL;')
);

exports.down = (knex) => (
  knex.schema
    .table('data_contributions', (table) => {
      table.dropColumn('url');
      table.renameColumn('data_url', 'url');
    })
    .raw('ALTER TABLE data_contributions ALTER COLUMN url SET NOT NULL;')
);
