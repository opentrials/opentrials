'use strict';

const uuid = require('node-uuid');

function getOrganisation() {
  const organisation = {
    id: uuid.v1(),
    name: 'test organisation',
  };

  return organisation;
}

module.exports = getOrganisation;
