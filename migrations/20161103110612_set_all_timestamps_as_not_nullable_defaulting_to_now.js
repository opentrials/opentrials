'use strict';

exports.up = (knex) => {
  function updateTimestampDefaults(schema, table) {
    return schema
      .raw(`UPDATE ${table} SET created_at = NOW() WHERE created_at IS NULL`)
      .raw(`UPDATE ${table} SET updated_at = NOW() WHERE updated_at IS NULL`)
      .raw(`
        ALTER TABLE ${table}
          ALTER COLUMN created_at SET NOT NULL,
          ALTER COLUMN created_at SET DEFAULT NOW(),
          ALTER COLUMN updated_at SET NOT NULL,
          ALTER COLUMN updated_at SET DEFAULT NOW()
      `);
  }

  return updateTimestampDefaults(knex.schema, 'users')
    .then(() => updateTimestampDefaults(knex.schema, 'data_contributions'));
};

exports.down = (knex) => (
  knex.schema
    .raw(`
      ALTER TABLE users
        ALTER COLUMN created_at DROP NOT NULL,
        ALTER COLUMN created_at DROP DEFAULT,
        ALTER COLUMN updated_at DROP NOT NULL,
        ALTER COLUMN updated_at DROP DEFAULT
    `)
    .raw(`
      ALTER TABLE data_contributions
        ALTER COLUMN created_at DROP NOT NULL,
        ALTER COLUMN created_at DROP DEFAULT,
        ALTER COLUMN updated_at DROP NOT NULL,
        ALTER COLUMN updated_at DROP DEFAULT
    `)
);
