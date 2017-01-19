'use strict';

function underscoresToCapitalized(underscoresStr) {
  if (!underscoresStr) {
    return underscoresStr;
  }

  // eslint-disable-next-line max-len
  const capitalized = (underscoresStr.charAt(0).toUpperCase() + underscoresStr.slice(1).toLowerCase());
  return capitalized.replace(/_/g, ' ');
}

module.exports = underscoresToCapitalized;
