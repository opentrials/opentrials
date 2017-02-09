'use strict';

exports.up = (knex) => (
  knex('data_categories').where({ group: '' }).update({ group: null })
);

exports.down = (knex) => (
  knex('data_categories').where({ group: null }).update({ group: '' })
);
