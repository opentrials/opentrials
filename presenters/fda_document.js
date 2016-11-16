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

    if (result.pages !== undefined && result.pages.length > 0) {
      result.pages = result.pages.map((page) => (
        Object.assign(
          {},
          page,
          {
            documentcloud_url: `${result.documentcloud_url}#search/p${page.num}`,
          }
        )
      ));
    }
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
