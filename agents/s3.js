'use strict';

const uuid = require('node-uuid');
const crypto = require('crypto');
const config = require('../config');


function _hmac(key, string) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.end(string);
  return hmac.read();
}

function _dateString() {
  const date = new Date().toISOString();
  return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);
}

function _s3UploadSignature(s3Config, policyBase64) {
  const dateKey = _hmac(`AWS4${s3Config.secretAccessKey}`, _dateString());
  const dateRegionKey = _hmac(dateKey, s3Config.region);
  const dateRegionServiceKey = _hmac(dateRegionKey, 's3');
  const signingKey = _hmac(dateRegionServiceKey, 'aws4_request');
  return _hmac(signingKey, policyBase64).toString('hex');
}

function _s3UploadPolicy(s3Config, key, credential, additionalConditions) {
  return {
    // 30 minutes into the future
    expiration: new Date((new Date).getTime() + (30 * 60 * 1000)).toISOString(),
    conditions: [
      { bucket: s3Config.bucket },
      ['starts-with', '$key', 'uploads/'],
      { acl: 'public-read' },
      { success_action_status: '201' },
      ['content-length-range', 0, s3Config.maxUploadSize],
      ['starts-with', '$Content-Type', ''],
      { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
      { 'x-amz-credential': credential },
      { 'x-amz-date': `${_dateString()}T000000Z` },
    ].concat(additionalConditions),
  };
}

function _amzCredential(s3Config) {
  return [s3Config.accessKeyId, _dateString(), s3Config.region, 's3/aws4_request'].join('/');
}

function _s3Params(s3Config, key, additionalConditions) {
  const credential = _amzCredential(s3Config);
  const policy = _s3UploadPolicy(s3Config, key, credential, additionalConditions);
  const policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64');

  return {
    key,
    acl: 'public-read',
    success_action_status: '201',
    Policy: policyBase64,
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': credential,
    'X-Amz-Date': `${_dateString()}T000000Z`,
    'X-Amz-Signature': _s3UploadSignature(s3Config, policyBase64),
  };
}

function _getActionUrl(region, bucket) {
  let actionUrl;

  if (region === 'us-east-1') {
    actionUrl = `https://s3.amazonaws.com/${bucket}`;
  } else {
    actionUrl = `https://s3-${region}.amazonaws.com/${bucket}`;
  }

  return actionUrl;
}


function getSignedFormFields(additionalConditions) {
  const key = 'uploads/' + uuid.v4() + '/${filename}'; // eslint-disable-line prefer-template
  const form = _s3Params(config.s3, key, additionalConditions || []);

  return {
    action: _getActionUrl(config.s3.region, config.s3.bucket),
    fields: form,
  };
}

module.exports = {
  getSignedFormFields,
  MAX_UPLOAD_SIZE: config.s3.maxUploadSize,
};
