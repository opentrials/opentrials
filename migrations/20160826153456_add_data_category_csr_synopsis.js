'use strict';

exports.up = (knex) => (
  knex('data_categories')
    .insert({ name: 'Clinical study report synopsis' })
);

exports.down = (knex) => (
  knex('data_categories')
    .where({ name: 'Clinical study report synopsis' })
    .del()
);
