'use strict';

function formatNumber(number) {
  if (number) {
    return number.toLocaleString('en-GB');
  }
}

module.exports = formatNumber;
