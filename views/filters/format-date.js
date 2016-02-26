const moment = require('moment');

function formatDate(date) {
  return moment(date).format('DD/MMM/YYYY');
}

module.exports = formatDate;
