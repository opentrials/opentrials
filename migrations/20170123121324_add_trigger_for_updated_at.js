'use strict';

const Promise = require('bluebird');

const tablesWithUpdatedAt = ['users', 'data_contributions'];

exports.up = (knex) => (
  knex.raw(
    `CREATE FUNCTION set_updated_at()
      RETURNS TRIGGER
      LANGUAGE plpgsql
    AS $$
    BEGIN
      NEW.updated_at := now();
      RETURN NEW;
    END;
    $$;`
  ).then(() =>
     Promise.map(tablesWithUpdatedAt, (table) =>
      knex.raw(
        `CREATE TRIGGER ${table}_set_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW EXECUTE PROCEDURE set_updated_at();`
      )
    )
  )
);

exports.down = (knex) => (
   Promise.map(tablesWithUpdatedAt, (table) =>
    knex.raw(`DROP TRIGGER ${table}_set_updated_at ON ${table};`)
  ).then(() =>
    knex.raw('DROP FUNCTION set_updated_at();')
  )
);

