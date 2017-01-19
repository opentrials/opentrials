'use strict';

const organisations = require('../../agents/organisations');

describe('Organisations', () => {
  describe('#get', () => {
    it('returns the organisation', () => {
      const data = {
        id: 1,
        name: 'foo',
      };
      apiServer.get('/organisations/1').reply(200, data);
      return organisations.get(1).should.be.fulfilledWith(data);
    });

    it('rejects if organisationId is inexistent', () => {
      apiServer.get('/organisations/1').reply(404);

      return organisations.get(1).should.be.rejectedWith({
        errObj: { status: 404 },
      });
    });
  });
});
