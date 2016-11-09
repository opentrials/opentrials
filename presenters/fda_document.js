'use strict';

function decorateFile(file) {
  if (file === undefined) {
    return file;
  }
  const result = Object.assign(
    {},
    file
  );

  if (result.documentcloud_id !== undefined) {
    result.documentcloud_url = `https://www.documentcloud.org/documents/${file.documentcloud_id}.html`;
  }

  return result;
}

function decorateFDADocument(fdaDocument) {
  return Object.assign(
    {},
    fdaDocument,
    {
      file: decorateFile(fdaDocument.file),
    }
  );
}

module.exports = decorateFDADocument;
