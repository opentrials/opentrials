'use strict';

const should = require('should');
const fdaDocuments = require('../../agents/fda_documents');
const decorateFDADocument = require('../../presenters/fda_document');

describe('FDA Documents', () => {
  describe('#search', () => {
    const response = {
      total_count: 2,
      items: [
        fixtures.getFDADocument(),
        fixtures.getFDADocument(),
      ],
    };
    const expectedResponse = {
      total_count: response.total_count,
      items: response.items.map((doc) => decorateFDADocument(doc)),
    };

    it('returns the response from the search API', () => {
      apiServer.get('/search/fda_documents').reply(200, response);

      return should(fdaDocuments.search()).be.fulfilledWith(expectedResponse);
    });

    it('passes the query to the search API', () => {
      apiServer.get('/search/fda_documents').query({ q: 'foo bar' }).reply(200, response);

      return should(fdaDocuments.search('foo bar')).be.fulfilledWith(expectedResponse);
    });

    it('passes the text query to the search API', () => {
      apiServer.get('/search/fda_documents').query({ text: 'foo bar' }).reply(200, response);

      return should(fdaDocuments.search(undefined, 'foo bar')).be.fulfilledWith(expectedResponse);
    });

    it('escapes the text query', () => {
      apiServer.get('/search/fda_documents').query({ text: 'foo\\(' }).reply(200, response);

      return should(fdaDocuments.search(undefined, 'foo(')).be.fulfilledWith(expectedResponse);
    });

    it('passes the page number to the query', () => {
      apiServer.get('/search/fda_documents').query({ page: 2 }).reply(200, response);

      return should(fdaDocuments.search(undefined, undefined, 2)).be.fulfilledWith(expectedResponse);
    });

    it('passes the number of items per page to the query', () => {
      apiServer.get('/search/fda_documents').query({ per_page: 12 }).reply(200, response);

      return should(fdaDocuments.search(undefined, undefined, undefined, 12)).be.fulfilledWith(expectedResponse);
    });

    it('rejects the promise if there was some problem with the API call', () => {
      apiServer.get('/search/fda_documents').reply(500);

      return should(fdaDocuments.search()).be.rejected();
    });
  });
});
