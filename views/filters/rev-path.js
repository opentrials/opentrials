'use strict';

const assert = require('assert');
const manifest = require('../../dist/rev-manifest');  // eslint-disable-line import/no-unresolved

function revPath(filename) {
  const filePath = manifest[filename];

  assert(filePath, `File "${filename}" doesn't exist in the rev-manifest.json`);

  return `/assets/${filePath}`;
}

module.exports = revPath;
