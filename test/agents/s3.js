'use strict';

const should = require('should');
const sinon = require('sinon');
const uuid = require('node-uuid');
const s3 = require('../../agents/s3');
const config = require('../../config');


describe('S3 Agent', () => {
  describe('#getSignedUrlAndFields', () => {
    const originalS3Config = Object.assign({}, config.s3);
    let clock;

    before(() => {
      clock = sinon.useFakeTimers();
      sinon.stub(uuid, 'v1', () => '00000000-0000-0000-0000-000000000000');
    });

    after(() => {
      clock.restore();
      uuid.v1.restore();
    });

    afterEach(() => {
      config.s3 = Object.assign({}, originalS3Config);
    });

    it('has the correct fields', () => {
      should(s3.getSignedFormFields()).containDeep({
        fields: {
          'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          'X-Amz-Credential': `${config.s3.accessKeyId}/19700101/${config.s3.region}/s3/aws4_request`,
          'X-Amz-Date': '19700101T000000Z',
          acl: 'public-read',
          key: 'uploads/00000000-0000-0000-0000-000000000000/${filename}',  // eslint-disable-line no-template-curly-in-string
          success_action_status: '201',
        },
      });
    });

    it('has the correct action when region is "us-east-1"', () => {
      config.s3.region = 'us-east-1';

      should(s3.getSignedFormFields()).containDeep({
        action: `https://s3.amazonaws.com/${config.s3.bucket}`,
      });
    });

    it('has the correct action when region is different than "us-east-1"', () => {
      config.s3.region = 'foobar';

      should(s3.getSignedFormFields()).containDeep({
        action: `https://s3-${config.s3.region}.amazonaws.com/${config.s3.bucket}`,
      });
    });

    it('has the correct Policy', () => {
      const policyBase64 = s3.getSignedFormFields().fields.Policy;
      const policy = JSON.parse(new Buffer(policyBase64, 'base64'));

      should(policy).deepEqual({
        expiration: '1970-01-01T00:30:00.000Z',
        conditions: [
          { bucket: config.s3.bucket },
          ['starts-with', '$key', 'uploads/'],
          { acl: 'public-read' },
          { success_action_status: '201' },
          ['content-length-range', 0, config.s3.maxUploadSize],
          ['starts-with', '$Content-Type', ''],
          { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
          { 'x-amz-credential': `${config.s3.accessKeyId}/19700101/${config.s3.region}/s3/aws4_request` },
          { 'x-amz-date': '19700101T000000Z' },
        ],
      });
    });

    it('allows adding additional conditions', () => {
      const additionalConditions = [
        ['starts-with', '$comments', ''],
        ['starts-with', '$foobar', ''],
      ];
      const policyBase64 = s3.getSignedFormFields(additionalConditions).fields.Policy;
      const policy = JSON.parse(new Buffer(policyBase64, 'base64'));

      should(policy.conditions).containDeep(additionalConditions);
    });
  });
});
