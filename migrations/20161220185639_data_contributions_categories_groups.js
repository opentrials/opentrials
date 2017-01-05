'use strict';

exports.up = (knex) => knex
  .schema
  .table('data_categories', (table) => {
    table.text('group')
      .nullable();
  })
  .alterTable('data_categories', (table) => {
    table.unique(['name', 'group']);
    table.dropUnique('name');
  });


exports.down = (knex) => knex
  .schema
  .alterTable('data_categories', (table) => {
    table.dropUnique(['name', 'group']);
    table.unique('name');
  })
  .table('data_categories', (table) => {
    table.dropColumns([
      'group',
    ]);
  });
