'use strict';

const should = require('should');
const fdaDocuments = require('../../agents/fda_documents');

describe('FDA Documents', () => {
  describe('#search', () => {
    const response = {
      total_count: 2,
      items: [
        fixtures.getFDADocument(),
        fixtures.getFDADocument(),
      ],
    };

    it('returns the response from the search API', () => {
      apiServer.get('/search/fda_documents').reply(200, response);

      return should(fdaDocuments.search()).be.fulfilledWith(response);
    });

    it('passes the page number to the query', () => {
      apiServer.get('/search/fda_documents').query({page: 2}).reply(200, response);

      return should(fdaDocuments.search(undefined, 2)).be.fulfilledWith(response);
    });

    it('passes the number of items per page to the query', () => {
      apiServer.get('/search/fda_documents').query({per_page: 12}).reply(200, response);

      return should(fdaDocuments.search(undefined, undefined, 12)).be.fulfilledWith(response);
    });

    it('rejects the promise if there was some problem with the API call', () => {
      apiServer.get('/search/fda_documents').reply(500);

      return should(fdaDocuments.search()).be.rejected();
    });
  });
});
