const highlight = require('highlight.js');

function jsonPrettyPrint(json) {
  const jsonHighlighted = highlight.highlight(
    'json',
    JSON.stringify(json, undefined, 2)
  ).value;

  return `<code class="json hljs">${jsonHighlighted}</code>`;
}

module.exports = jsonPrettyPrint;
