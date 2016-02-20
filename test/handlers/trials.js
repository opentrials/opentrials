const server = require('../../server');

describe('trials handler', () => {
  describe('GET /trials', () => {
    const trials = [
      fixtures.getTrial(),
      fixtures.getTrial(),
    ];
    let response;

    before(() => {
      apiServer.get('/trials').reply(200, trials);

      return server.inject('/trials')
        .then((_response) => {
          response = _response;
        });
    });

    it('is successful', () => {
      response.statusCode.should.equal(200)
    });

    it('uses the "trials-list" template', () => (
      response.request.response.source.template.should.equal('trials-list')
    ));

    it('adds the trials into the context', () => {
      const context = response.request.response.source.context;

      context.trials.map((trial) => {
        trial.registration_date = new Date(trial.registration_date);
        return trial;
      }).should.deepEqual(trials);
    });
  });

  describe('GET /trials/{id}', () => {
    const trial = fixtures.getTrial();
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
      context.trial.registration_date = new Date(context.trial.registration_date);
      context.trial.should.deepEqual(trial);
    });

    it('sets the title to the trial.public_title', () => {
      const context = response.request.response.source.context;
      context.title.should.equal(trial.public_title);
    });
  });
});
