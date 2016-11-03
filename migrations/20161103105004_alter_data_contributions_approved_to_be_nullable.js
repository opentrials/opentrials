'use strict';

exports.up = (knex) => (
  knex.schema
    .raw(`
      ALTER TABLE data_contributions
        ALTER COLUMN approved DROP NOT NULL,
        ALTER COLUMN approved DROP DEFAULT
    `)
);

exports.down = (knex) => (
  knex.schema
    .raw(`
      ALTER TABLE data_contributions
        ALTER COLUMN approved SET NOT NULL,
        ALTER COLUMN approved SET DEFAULT false
      `)
);
