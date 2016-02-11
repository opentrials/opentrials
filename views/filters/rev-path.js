const assert = require('assert');
const manifest = require('../../dist/rev-manifest');

function revPath(filename) {
  const filePath = manifest[filename];

  assert(filePath, `File "${filename}" doesn't exist in the rev-manifest.json`);

  return '/static/' + filePath;
}

module.exports = revPath;
