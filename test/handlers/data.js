'use strict';

const sinon = require('sinon');
const should = require('should');
const config = require('../../config');
const s3 = require('../../agents/s3');


describe('data handler', () => {
  let server;
  before(() => getExplorerServer().then((_server) => (server = _server)));

  beforeEach(() => {
    sinon.stub(s3, 'listObjects').resolves({
      Contents: [],
    });
  });

  afterEach(() => {
    s3.listObjects.restore();
  });

  describe('GET /data', () => {
    it('is successful', () => (
      server.inject('/data')
        .then((response) => {
          response.statusCode.should.equal(200);
        })
    ));

    it('uses the "data" template', () => (
      server.inject('/data')
        .then((response) => {
          response.request.response.source.template.should.equal('data');
        })
    ));

    it('sets the title and description', () => (
      server.inject('/data')
        .then((response) => {
          const context = response.request.response.source.context;
          context.should.have.property('title');
          context.should.have.property('description');
        })
    ));

    it('parses and add the dumps to the context', () => {
      s3.listObjects.resolves({
        Contents: [
          {
            Key: 'uploads/opentrials-api-2017-01-01.dump',
            Size: 100,
          },
        ],
      });

      return server.inject('/data')
        .then((response) => {
          const context = response.request.response.source.context;
          const dumps = context.dumps;

          should(dumps).be.deepEqual([
            {
              url: `${config.s3.customDomain}/uploads/opentrials-api-2017-01-01.dump`,
              label: 'opentrials-api-2017-01-01.dump',
              size: 100,
            },
          ]);
        });
    });
  });
});
