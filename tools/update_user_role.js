/* eslint no-console: 0 */

'use strict';

const User = require('../models/user');

function updateUserRole(email, role) {
  return User.where({ email })
    .save({ role }, { patch: true, require: true });
}

if (require.main === module) {
  const argv = process.argv;
  if (argv.length < 3 || argv.length > 4) {
    console.error(`Usage: node ${__filename} <email> [role]`);
    process.exit(-1);
  }

  const email = argv[2];
  const role = argv[3] || null;

  updateUserRole(email, role)
    .then(() => {
      console.log(`Updated user "${email}" to role "${role}"`);
      process.exit(0);
    })
    .catch((err) => {
      if (err.message === 'No Rows Updated') {
        console.error(`Could not find an user with email "${email}"`);
      } else if (err.constraint === 'users_role_check') {
        console.error(`Role "${role}" is invalid`);
      } else {
        console.error(err);
      }

      process.exit(-1);
    });
}
