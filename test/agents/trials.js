'use strict';

const should = require('should');
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
      apiServer.get('/search').query({q: 'foo bar'}).reply(200, response);

      return trials.search('foo bar').should.be.fulfilledWith(expectedResponse);
    });

    it('passes the page number to the query', () => {
      apiServer.get('/search').query({page: 2}).reply(200, response);

      return trials.search(undefined, 2).should.be.fulfilledWith(expectedResponse);
    });

    it('passes the number of items per page to the query', () => {
      apiServer.get('/search').query({per_page: 12}).reply(200, response);

      return trials.search(undefined, undefined, 12).should.be.fulfilledWith(expectedResponse);
    });

    it('adds the filters to the query string', () => {
      apiServer.get('/search')
        .query({q: '(foo bar) AND location:("Czech Republic")'})
        .reply(200, response);

      return trials.search('foo bar', undefined, undefined, { location: '"Czech Republic"' })
        .should.be.fulfilledWith(expectedResponse);
    });

    it('accepts list of values to a single filter', () => {
      apiServer.get('/search')
        .query({q: '(foo bar) AND location:("Czech Republic" OR "Brazil")'})
        .reply(200, response);

      return trials.search('foo bar', undefined, undefined, { location: ['"Czech Republic"', '"Brazil"'] })
        .should.be.fulfilledWith(expectedResponse);
    });

    it('rejects the promise if there was some problem with the API call', () => {
      apiServer.get('/search').reply(500);

      return trials.search().should.be.rejected();
    });
  });

  describe('#getRecord', () => {
    it('returns the record', () => {
      const record = fixtures.getRecord();
      apiServer.get(`/trials/${record.trial_id}/records/${record.id}`).reply(200, record);

      return trials.getRecord(record.id, record.trial_id)
        .then((response) => {
          const expectedResponse = JSON.parse(JSON.stringify(record));
          should(response).deepEqual(expectedResponse);
        });
    });

    it('rejects the promise if there was some problem with the API call', () => {
      const record = fixtures.getRecord();
      apiServer.get(`/trials/${record.trial_id}/records/${record.id}`).reply(500);

      return trials.getRecord(record.id, record.trial_id).should.be.rejected();
    });
  });

  describe('#getDiscrepancies', () => {
    const trial = fixtures.getTrial();

    it('returns an empty array when there\'re no discrepancies', () => {
      const record = fixtures.getRecord();
      const response = [
        record,
        record,
      ];
      apiServer.get(`/trials/${trial.id}/records`).reply(200, response);

      return trials.getDiscrepancies(trial.id)
        .then((discrepancies) => should(discrepancies).be.empty());
    });

    it('rejects the promise if there was some problem with the API call', () => {
      apiServer.get(`/trials/${trial.id}/records`).reply(500);

      return trials.getDiscrepancies(trial.id).should.be.rejected();
    });

    it('returns a list with the fields with discrepancies among the trial records', () => {
      const record = fixtures.getRecord();
      const anotherRecord = fixtures.getRecord();
      anotherRecord.public_title = `${record.public_title} foo`;
      const response = [
        record,
        anotherRecord,
      ];
      apiServer.get(`/trials/${trial.id}/records`).reply(200, response);

      return trials.getDiscrepancies(trial.id)
        .then((discrepancies) => {
          const expectedDiscrepancies = [
            {
              field: 'public_title',
              records: response.map((record) => {
                return {
                  id: record.id,
                  source_name: record.source.name,
                  value: record.public_title,
                };
              }),
            },
          ];

          should(discrepancies).deepEqual(expectedDiscrepancies);
        });
    });

    it('returns discrepancies in all expected fields', () => {
      const record = fixtures.getRecord();
      const anotherRecord = Object.assign(fixtures.getRecord(), {
        public_title: `${record.public_title} foo`,
        brief_summary: `${record.brief_summary} foo`,
        target_sample_size: record.target_sample_size + 100,
        registration_date: new Date('1970-01-01'),
        gender: 'female',
      });
      record.gender = 'male';
      const response = [
        record,
        anotherRecord,
      ];
      apiServer.get(`/trials/${trial.id}/records`).reply(200, response);

      return trials.getDiscrepancies(trial.id)
        .then((discrepancies) => {
          const expectedFields = [
            'public_title',
            'brief_summary',
            'target_sample_size',
            'gender',
            'registration_date',
          ];
          const fields = discrepancies.map((discrepancy) => discrepancy.field);

          should(fields.sort()).eql(expectedFields.sort());
        });
    });
  });
});
