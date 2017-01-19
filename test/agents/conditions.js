'use strict';

const conditions = require('../../agents/conditions');

describe('Conditions', () => {
  describe('#get', () => {
    it('returns the condition', () => {
      const data = {
        id: 1,
        name: 'foo',
      };
      apiServer.get('/conditions/1').reply(200, data);
      return conditions.get(1).should.be.fulfilledWith(data);
    });

    it('rejects if conditionId is inexistent', () => {
      apiServer.get('/conditions/1').reply(404);

      return conditions.get(1).should.be.rejectedWith({
        errObj: { status: 404 },
      });
    });
  });
});
