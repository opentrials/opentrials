'use strict';

const _ = require('lodash');

function getAttributeById(items, id, attr) {
  const result = _.find(items, (i) => i.id === id);
  let value;
  if (result && result[attr]) {
    value = result[attr];
  } else {
    value = null;
  }

  return value;
}

module.exports = getAttributeById;
