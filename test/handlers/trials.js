'use strict';

const server = require('../../server');
const trialsAgent = require('../../agents/trials');

describe('trials handler', () => {
  describe('GET /trials/{id}', () => {
    describe('API is OK', () => {
      const trial = JSON.parse(JSON.stringify(
        fixtures.getTrial()
      ));
      let response;

      before(() => {
        apiServer.get('/trials/'+trial.id).reply(200, trial);

        return server.inject('/trials/'+trial.id)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('uses the "trials-list" template', () => (
        response.request.response.source.template.should.equal('trials-details')
      ));

      it('adds the requested trial to the context', () => {
        const context = response.request.response.source.context;
        context.trial.should.deepEqual(trial);
      });

      it('adds the contributeDataUrl to the context', () => {
        const context = response.request.response.source.context;
        const contributeDataUrl = `/contribute-data?trial_id=${trial.id}&redirectTo=/trials/${trial.id}`;
        context.contributeDataUrl.should.equal(contributeDataUrl);
      });

      it('sets the title to the trial.public_title', () => {
        const context = response.request.response.source.context;
        context.title.should.equal(trial.public_title);
      });

      it('returns 404 when trial doesnt exist', () => {
        apiServer.get('/trials/foo').reply(404);

        return server.inject('/trials/foo')
          .then((_response) => {
            _response.statusCode.should.equal(404);
          });
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/trials/foo').reply(500);

        return server.inject('/trials/foo')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });

  describe('GET /trials/{trialId}/records/{id}', () => {
    describe('API is OK', () => {
      const record = JSON.parse(JSON.stringify(
        fixtures.getRecord()
      ));
      let response;

      before(() => {
        apiServer.get(`/trials/${record.trial_id}/records/${record.id}`)
          .reply(200, record);

        return server.inject(`/trials/${record.trial_id}/records/${record.id}`)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('adds the requested record to the context', () => {
        const context = response.request.response.source.context;
        context.record.should.deepEqual(record);
      });

      it('sets the title to the record.public_title', () => {
        const context = response.request.response.source.context;
        context.title.should.equal(record.public_title);
      });

      it('returns 404 when record doesnt exist', () => {
        apiServer.get('/trials/foo/records/bar').reply(404);

        return server.inject('/trials/foo/records/bar')
          .then((_response) => {
            _response.statusCode.should.equal(404);
          });
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/trials/foo/records/bar').reply(500);

        return server.inject('/trials/foo/records/bar')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });

  describe('GET /trials/{id}/discrepancies', () => {
    describe('API is OK', () => {
      const records = JSON.parse(JSON.stringify(
        [
          fixtures.getRecord(),
          fixtures.getRecord(),
        ]
      ));
      const trialId = records[0].trial_id;
      let response;

      before(() => {
        apiServer.get(`/trials/${trialId}/records`)
          .reply(200, records);

        return server.inject(`/trials/${trialId}/discrepancies`)
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('adds the trial_id to the context', () => {
        const context = response.request.response.source.context;
        context.trial_id.should.eql(trialId);
      });

      it('adds the discrepancies to the context', () => {
        apiServer.get(`/trials/${trialId}/records`).reply(200, records);

        const context = response.request.response.source.context;
        return trialsAgent.getDiscrepancies(trialId)
          .then((discrepancies) => context.discrepancies.should.deepEqual(discrepancies));
      });

      it('returns 404 when trial doesnt exist', () => {
        apiServer.get('/trials/foo/records').reply(404);

        return server.inject('/trials/foo/discrepancies')
          .then((_response) => {
            _response.statusCode.should.equal(404);
          });
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/trials/foo/records').reply(500);

        return server.inject('/trials/foo/discrepancies')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });
});
