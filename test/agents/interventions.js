'use strict';

const interventions = require('../../agents/interventions');

describe('Interventions', () => {
  describe('#get', () => {
    it('returns the intervention', () => {
      const data = {
        id: 1,
        name: 'foo',
      };
      apiServer.get('/interventions/1').reply(200, data);
      return interventions.get(1).should.be.fulfilledWith(data);
    });

    it('rejects if interventionId is inexistent', () => {
      apiServer.get('/interventions/1').reply(404);

      return interventions.get(1).should.be.rejectedWith({
        errObj: { status: 404 },
      });
    });
  });
});
