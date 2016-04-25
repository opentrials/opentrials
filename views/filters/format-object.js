'use strict';

const underscoresToCapitalized = require('./underscores-to-capitalized');

function formatObject(json) {
  let result;

  if (Array.isArray(json)) {
    const data = json.map((element) => `<li>${formatObject(element)}</li>`).join('');
    result = `<ol>${data}</ol>`;
  } else if (json && typeof json === 'object') {
    const data = Object.keys(json).sort().map((key) => (
      `<dt>${underscoresToCapitalized(key)}</dt><dd>${formatObject(json[key])}</dd>`
    )).join('');
    result = `<dl>${data}</dl>`;
  } else {
    result = String(json);
  }

  return result;
}

module.exports = formatObject;
