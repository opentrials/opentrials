'use strict';

const should = require('should');
const _ = require('lodash');
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
      should(fdaDocument.file.documentcloud_url).eql(expectedUrl)
    });
  });
});
