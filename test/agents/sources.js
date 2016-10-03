'use strict';

const sources = require('../../agents/sources');

describe('Sources', () => {
  describe('#list', () => {
    it('returns the sources', () => {
      const data = [
        fixtures.getSource(),
        fixtures.getSource(),
      ];
      apiServer.get('/sources').reply(200, data);
      return sources.list().should.be.fulfilledWith(data);
    });

    it('rejects if API returns error', () => {
      apiServer.get('/sources').reply(500);

      return sources.list().should.be.rejectedWith({
        errObj: { status: 500 },
      });
    });
  });
});

