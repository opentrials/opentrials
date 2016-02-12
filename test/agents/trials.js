'use strict';

const trials = require('../../agents/trials');

describe('Trials', () => {
  describe('#get', () => {
    it('returns the trial', () => {
      const data = {
        id: 1,
        title: 'foo',
      };
      apiServer.get('/trials/1').reply(200, data);

      return trials.get(1).should.be.fulfilledWith(data);
    });

    it('rejects if trialId is inexistent', () => {
      apiServer.get('/trials/1').reply(404);

      return trials.get(1).should.be.rejectedWith({
        errObj: { status: 404 },
      });
    });
  });

  describe('#list', () => {
    it('returns the list of trials', () => {
      const data = [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' },
      ];
      apiServer.get('/trials').reply(200, data);

      return trials.list().should.be.fulfilledWith(data);
    });
  });
});
