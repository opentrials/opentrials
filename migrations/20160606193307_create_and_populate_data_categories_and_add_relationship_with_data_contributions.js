'use strict';

exports.up = (knex) => (
  knex.schema
    .createTable('data_categories', (table) => {
      table.increments('id');
      table.string('name')
        .notNullable()
        .unique();
    })
    .table('data_contributions', (table) => {
      table.integer('data_category_id')
        .references('data_categories.id')
        .nullable();
    })
    .then(() => knex('data_categories').insert([
      { name: 'Clinical study report' },
      { name: 'Analytics code' },
      { name: 'Patient information sheet' },
      { name: 'Consent forms' },
      { name: 'Case report forms' },
      { name: 'Trial protocols' },
      { name: 'Statistical analysis plan' },
      { name: 'Lay summaries' },
      { name: 'European Public Assessment Report (EPAR) document' },
      { name: 'U.S. Food and Drug Administration (FDA) document' },
      { name: 'Registry entry' },
      { name: 'Publication (press release, article, blog post, etc.)' },
      { name: 'Trial webpage' },
      { name: 'Critical review' },
      { name: 'Condition' },
      { name: 'Treatment' },
      { name: 'Other' },
    ]))
);

exports.down = (knex) => (
  knex.schema
    .table('data_contributions', (table) => {
      table.dropColumn('data_category_id');
    })
    .dropTableIfExists('data_categories')
);
