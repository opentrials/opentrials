'use strict';

const should = require('should');
const fdaDocumentPresenter = require('../../presenters/fda_document');

describe('fdaDocument presenter', () => {
  it('keeps the original attributes', () => {
    const attributes = { foo: 'bar' };
    const fdaDocument = fdaDocumentPresenter(attributes);

    should(fdaDocument).containDeep(attributes);
  });

  describe('file', () => {
    it('adds "documentcloud_url" if it is in documentcloud', () => {
      const fdaDocument = fdaDocumentPresenter({
        file: {
          documentcloud_id: '10000',
        },
      });

      const expectedUrl = `https://www.documentcloud.org/documents/${fdaDocument.file.documentcloud_id}.html`;
      should(fdaDocument.file.documentcloud_url).eql(expectedUrl);
    });
  });

  it('adds "documentcloud_url" on its pages if they exist and the file is in documentcloud', () => {
    const fdaDocument = fdaDocumentPresenter({
      file: {
        documentcloud_id: '10000',
        pages: [
          {
            text: 'Lorem ipsum',
            num: 1,
          },
          {
            text: 'dolor sit amet',
            num: 2,
          },
        ],
      },
    });

    const expectedBaseUrl = `https://www.documentcloud.org/documents/${fdaDocument.file.documentcloud_id}.html#search/`;
    fdaDocument.file.pages.forEach((page) => {
      const expectedUrl = `${expectedBaseUrl}p${page.num}`;
      should(page.documentcloud_url).eql(expectedUrl);
    });
  });
});
