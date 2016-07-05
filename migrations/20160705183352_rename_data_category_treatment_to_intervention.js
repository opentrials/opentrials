'use strict';

exports.up = (knex) => (
  knex('data_categories')
    .where({ name: 'Treatment' })
    .update({ name: 'Intervention' })
);

exports.down = (knex) => (
  knex('data_categories')
    .where({ name: 'Intervention' })
    .update({ name: 'Treatment' })
);
