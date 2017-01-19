'use strict';

function formatNumber(number) {
  if (number !== undefined) {
    return number.toLocaleString('en-GB');
  }
  return undefined;
}

module.exports = formatNumber;
