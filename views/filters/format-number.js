'use strict';

function formatNumber(number) {
  if (number !== undefined) {
    return number.toLocaleString('en-GB');
  }
}

module.exports = formatNumber;
