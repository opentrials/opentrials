'use strict';

const oldCategories = [
  {
    id: 21,
    name: 'Journal article',
    group: 'Results',
  }, {
    id: 22,
    name: 'Clinical study report',
    group: 'Results',
  }, {
    id: 23,
    name: 'Clinical study report synopsis',
    group: 'Results',
  }, {
    id: 24,
    name: 'European Public Assessment Report (EPAR) document section',
    group: 'Results',
  }, {
    id: 25,
    name: 'U.S. Food and Drug Administration (FDA) document segment',
    group: 'Results',
  }, {
    id: 26,
    name: 'Press release describing results',
    group: 'Results',
  }, {
    id: 27,
    name: 'Conference abstract or proceedings describing results',
    group: 'Results',
  }, {
    id: 28,
    name: 'Report to funder',
    group: 'Results',
  }, {
    id: 29,
    name: 'Case report form',
    group: 'Study documents',
  }, {
    id: 30,
    name: 'Grant application',
    group: 'Study documents',
  }, {
    id: 31,
    name: 'IRB/HREC approval documents',
    group: 'Study documents',
  }, {
    id: 32,
    name: 'Investigator\'\'s Brochure',
    group: 'Study documents',
  }, {
    id: 33,
    name: 'Patient information sheet / Consent form',
    group: 'Study documents',
  }, {
    id: 34,
    name: 'Statistical analysis plan',
    group: 'Study documents',
  }, {
    id: 35,
    name: 'Trial protocol',
    group: 'Study documents',
  }, {
    id: 36,
    name: 'Analytic code',
    group: 'Study documents',
  }, {
    id: 37,
    name: 'Trialists\'\' webpage',
    group: 'Study documents',
  }, {
    id: 38,
    name: 'Lay summary, design of ongoing study',
    group: 'Lay summaries',
  }, {
    id: 39,
    name: 'Lay summary, results of completed study',
    group: 'Lay summaries',
  }, {
    id: 40,
    name: 'Link to individual patient data for trial',
    group: 'Data',
  }, {
    id: 41,
    name: 'Structured data about trial extracted for systematic review',
    group: 'Data',
  }, {
    id: 42,
    name: 'Blog about trial design or results',
    group: 'Miscellaneous',
  }, {
    id: 43,
    name: 'Journal article critiquing trial design or results',
    group: 'Miscellaneous',
  }, {
    id: 44,
    name: 'Systematic review including trial',
    group: 'Miscellaneous',
  }, {
    id: 45,
    name: 'Review article citing trial',
    group: 'Miscellaneous',
  }, {
    id: 46,
    name: 'News article about trial or results',
    group: 'Miscellaneous',
  }, {
    id: 47,
    name: 'Press release about trial',
    group: 'Miscellaneous',
  }, {
    id: 48,
    name: 'Report from sponsor describing trial or results',
    group: 'Miscellaneous',
  }, {
    id: 49,
    name: 'Journal article, secondary or independent re-analysis of results',
    group: 'Miscellaneous',
  }, {
    id: 19,
    name: 'Registry entry',
    group: null,
  }, {
    id: 20,
    name: 'Other',
    group: null,
  },
];

exports.up = (knex) => knex.schema
  .table('data_contributions', (table) => {
    table.dropForeign('data_category_id');
    table.renameColumn('data_category_id', 'document_category_id');
  })
  .dropTable('data_categories')
;

exports.down = (knex) => knex.schema
    .createTable('data_categories', (table) => {
      table.increments('id');
      table.string('name')
        .notNullable();
      table.string('group');
    })
    .table('data_categories', (table) => {
      table.unique(['name', 'group']);
    })
    .table('data_contributions', (table) => {
      table.renameColumn('document_category_id', 'data_category_id');
      table.foreign('data_category_id').references('data_categories.id');
    }).then(() => knex.batchInsert('data_categories', oldCategories, 50))
;
