'use strict';

const moment = require('moment');

function formatDate(date) {
  if (date) {
    return moment(date).format('DD/MMM/YYYY');
  }
  return undefined;
}

module.exports = formatDate;
