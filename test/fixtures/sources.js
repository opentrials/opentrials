'use strict';

let count = 0;

function getSource() {
  const source = {
    id: `source${count}`,
    name: `Source ${count}`,
    source_url: `http://example.org/source${count}`,
    terms_and_conditions_url: `http://example.org/source${count}`,
  };

  count += 1;

  return source;
}

module.exports = getSource;
