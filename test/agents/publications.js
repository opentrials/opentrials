'use strict';

const publications = require('../../agents/publications');

describe('Publications', () => {
  describe('#get', () => {
    it('returns the publication', () => {
      const data = {
        id: 1,
        title: 'foo',
      };
      apiServer.get('/publications/1').reply(200, data);
      return publications.get(1).should.be.fulfilledWith(data);
    });

    it('rejects if publicationId is inexistent', () => {
      apiServer.get('/publications/1').reply(404);

      return publications.get(1).should.be.rejectedWith({
        errObj: { status: 404 },
      });
    });
  });
});
