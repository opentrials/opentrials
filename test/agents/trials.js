'use strict';

const trials = require('../../agents/trials');

describe('Trials', () => {
  describe('#get', () => {
    it('returns the trial', () => {
      const trial = {
        id: 1,
        title: 'foo',
      };
      apiServer.get('/trials/1').reply(200, trial);

      return trials.get(1).should.be.fulfilledWith(trial);
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
      const trials = [
        { id: 1, title: 'foo' },
        { id: 2, title: 'bar' },
      ];
      apiServer.get('/trials').reply(200, trials);

      return trials.list().should.be.fulfilledWith(trials);
    });
  });
});
