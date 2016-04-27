'use strict';
const problems = require('../../agents/problems');

describe('Problems', () => {
  describe('#get', () => {
    it('returns the problem', () => {
      const data = {
        id: 1,
        name: 'foo',
      };
      apiServer.get('/problems/1').reply(200, data);
      return problems.get(1).should.be.fulfilledWith(data);
    });

    it('rejects if problemId is inexistent', () => {
      apiServer.get('/problems/1').reply(404);

      return problems.get(1).should.be.rejectedWith({
        errObj: { status: 404 },
      });
    });
  });
});