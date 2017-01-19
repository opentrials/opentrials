'use strict';

const persons = require('../../agents/persons');

describe('Persons', () => {
  describe('#get', () => {
    it('returns the person', () => {
      const data = {
        id: 1,
        name: 'foo',
      };
      apiServer.get('/persons/1').reply(200, data);
      return persons.get(1).should.be.fulfilledWith(data);
    });

    it('rejects if personId is inexistent', () => {
      apiServer.get('/persons/1').reply(404);

      return persons.get(1).should.be.rejectedWith({
        errObj: { status: 404 },
      });
    });
  });
});
