'use strict';

exports.up = (knex, Promise) => {
  knex.schema
    .table('data_contributions', (table) => {
      table.text('group')
        .nullable();
    });
};

exports.down = (knex, Promise) => {
  knex.schema
    .table('data_contributions', (table) => {
      table.dropColumns([
        'group',
      ]);
    });
};
