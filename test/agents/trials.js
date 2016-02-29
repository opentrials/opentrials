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

  describe('#search', () => {
    const response = {
      total_count: 2,
      items: [
        fixtures.getTrial(),
        fixtures.getTrial(),
      ]
    };
    const expectedResponse = JSON.parse(JSON.stringify(response));

    it('returns the response from the search API', () => {
      apiServer.get('/search').reply(200, response);

      return trials.search().should.be.fulfilledWith(expectedResponse);
    });

    it('encodes the query string', () => {
      apiServer.get('/search?q=foo%20bar').reply(200, response);

      return trials.search('foo bar').should.be.fulfilledWith(expectedResponse);
    });

    it('passes the page number to the query', () => {
      apiServer.get('/search?q=foo&page=2').reply(200, response);

      return trials.search('foo', 2).should.be.fulfilledWith(expectedResponse);
    });

    it('rejects the promise if there was some problem with the API call', () => {
      apiServer.get('/search').reply(500);

      return trials.search().should.be.rejected();
    });
  });
});
