'use strict';

const should = require('should');
const sinon = require('sinon');
const uuid = require('node-uuid');
const s3 = require('../../agents/s3');
const s3Config = require('../../config').s3;


describe('S3 Agent', () => {
  describe('#getSignedUrlAndFields', () => {
    let clock;

    before(() => {
      clock = sinon.useFakeTimers();
      sinon.stub(uuid, 'v4', () => '00000000-0000-0000-0000-000000000000');
    });

    after(() => {
      clock.restore();
      uuid.v4.restore();
    });

    it('has the correct action and fields', () => {
      should(s3.getSignedFormFields()).containDeep({
        action: `https://${s3Config.bucket}.s3.amazonaws.com`,
        fields: {
          'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
          'X-Amz-Credential': `${s3Config.accessKeyId}/19700101/${s3Config.region}/s3/aws4_request`,
          'X-Amz-Date': '19700101T000000Z',
          acl: 'public-read',
          key: 'uploads/00000000-0000-0000-0000-000000000000/${filename}',
          success_action_status: '201'
        }
      });
    });

    it('has the correct Policy', () => {
      const policyBase64 = s3.getSignedFormFields().fields.Policy;
      const policy = JSON.parse(new Buffer(policyBase64, 'base64'));

      should(policy).deepEqual({
        expiration: '1970-01-01T00:30:00.000Z',
        conditions: [
          { bucket: s3Config.bucket },
          [ 'starts-with', '$key', 'uploads/' ],
          { acl: 'public-read' },
          { success_action_status: '201' },
          [ 'content-length-range', 0, s3Config.maxUploadSize ],
          [ 'starts-with', '$Content-Type', '' ],
          { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
          { 'x-amz-credential': `${s3Config.accessKeyId}/19700101/${s3Config.region}/s3/aws4_request` },
          { 'x-amz-date': '19700101T000000Z' }
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
