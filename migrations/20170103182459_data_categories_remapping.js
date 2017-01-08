'use strict';

const _ = require('lodash');

const newCategories = [
  { name: 'Registry entry',
    group: '',
    replaces: ['Registry entry'] },
  { name: 'Other',
    group: '',
    replaces: [
      'Other',
      'Publication (press release, article, blog post, etc.)',
      'Trial webpage',
      'Condition',
      'Intervention',
    ] },

  { name: 'Journal article',
    group: 'Results' },
  { name: 'Clinical study report',
    group: 'Results',
    replaces: ['Clinical study report'] },
  { name: 'Clinical study report synopsis',
    group: 'Results',
    replaces: ['Clinical study report synopsis'] },
  { name: 'European Public Assessment Report (EPAR) document section',
    group: 'Results',
    replaces: ['European Public Assessment Report (EPAR) document'] },
  { name: 'U.S. Food and Drug Administration (FDA) document segment',
    group: 'Results',
    replaces: ['U.S. Food and Drug Administration (FDA) document'] },
  { name: 'Press release describing results',
    group: 'Results' },
  { name: 'Conference abstract or proceedings describing results',
    group: 'Results' },
  { name: 'Report to funder',
    group: 'Results' },

  { name: 'Case report form',
    group: 'Study documents',
    replaces: ['Case report forms'] },
  { name: 'Grant application',
    group: 'Study documents' },
  { name: 'IRB/HREC approval documents',
    group: 'Study documents' },
  { name: 'Investigator\'\'s Brochure',
    group: 'Study documents' },
  { name: 'Patient information sheet / Consent form',
    group: 'Study documents',
    replaces: ['Patient information sheet', 'Consent forms'] },
  { name: 'Statistical analysis plan',
    group: 'Study documents',
    replaces: ['Statistical analysis plan'] },
  { name: 'Trial protocol',
    group: 'Study documents',
    replaces: ['Trial protocols'] },
  { name: 'Analytic code',
    group: 'Study documents',
    replaces: ['Analytics code'] },
  { name: 'Trialists\'\' webpage',
    group: 'Study documents',
    replaces: ['Trial webpage'] },

  { name: 'Lay summary, design of ongoing study',
    group: 'Lay summaries' },
  { name: 'Lay summary, results of completed study',
    group: 'Lay summaries',
    replaces: ['Lay summaries'] },

  { name: 'Link to individual patient data for trial',
    group: 'Data' },
  { name: 'Structured data about trial extracted for systematic review',
    group: 'Data' },

  { name: 'Blog about trial design or results',
    group: 'Miscellaneous' },
  { name: 'Journal article critiquing trial design or results',
    group: 'Miscellaneous',
    replaces: ['Critical review'] },
  { name: 'Systematic review including trial',
    group: 'Miscellaneous' },
  { name: 'Review article citing trial',
    group: 'Miscellaneous' },
  { name: 'News article about trial or results',
    group: 'Miscellaneous' },
  { name: 'Press release about trial',
    group: 'Miscellaneous' },
  { name: 'Report from sponsor describing trial or results',
    group: 'Miscellaneous' },
];

const toInsert = _.map(newCategories, (obj) => _.omit(obj, ['replaces']));
const toReplace = _.filter(newCategories, 'replaces');
const toDelete = _.reject(newCategories, (obj) => obj.replaces);

exports.up = (knex) => knex
  .batchInsert('data_categories', toInsert, 50)
  .then(() =>
        _.map(toReplace, (category) =>
              category.replaces.forEach((oldName) => knex
                                        .raw(`UPDATE data_contributions
                                              SET data_category_id = (SELECT id FROM data_categories
                                                            WHERE name = '${category.name}'
                                                            AND "group" = '${category.group}')
                                              WHERE data_category_id = (SELECT id FROM data_categories
                                                            WHERE name = '${oldName}'
                                                            AND "group" IS NULL);`)
                                        .then(() => knex
                                              .raw(`DELETE FROM data_categories
                                                    WHERE name = '${oldName}' AND "group" IS NULL;`))
        )
      )
    );

exports.down = (knex) => {
  const toRestore = [
    { name: 'Consent forms', group: null },
    { name: 'Publication (press release, article, blog post, etc.)', group: null },
    { name: 'Condition', group: null },
    { name: 'Intervention', group: null },
  ];

  return knex.batchInsert('data_categories', toRestore, 50)
    .then(() => {
      const replaceAction = _.map(toReplace, (category) =>
                                  knex('data_categories')
                                  .where({ name: category.name, group: category.group })
                                  .update({ name: category.replaces[0] })
                                  .then()
      );

      const deleteAction = _.map(toDelete, (category) => knex
                                 .raw(`UPDATE data_contributions
                                              SET data_category_id = null
                                              WHERE data_category_id = (
                                                SELECT id FROM data_categories WHERE name = '${category.name}');`)
                                 .then(() =>
                                       knex('data_categories')
                                       .where({ name: category.name, group: category.group })
                                       .del()
                                       .then()
                                      )
      );

      return replaceAction && deleteAction;
    });
};

exports.config = { transaction: false };
