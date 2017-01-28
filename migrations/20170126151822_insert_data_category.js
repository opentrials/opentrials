'use strict';

const newCategory = {
  name: 'Journal article, secondary or independent re-analysis of results',
  group: 'Miscellaneous',
};

exports.up = (knex) => (
  knex.insert(newCategory).into('data_categories')
);

exports.down = (knex) => (
  knex('data_categories').where(newCategory).del()
);
