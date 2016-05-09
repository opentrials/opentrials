'use strict';

const Boom = require('boom');
const Joi = require('joi');
const url = require('url');
const bluebird = require('bluebird');
const parseXml = bluebird.promisify(require('xml2js').parseString);
const s3 = require('../agents/s3');
const DataContribution = require('../models/data-contribution');

function _getContributeData(request, reply) {
  const additionalConditions = [
    ['starts-with', '$comments', ''],
  ];

  reply.view('contribute-data', {
    title: 'Contribute data',
    s3: s3.getSignedFormFields(additionalConditions),
    redirectTo: request.headers.referer,
  });
}

function _postContributeData(request, reply) {
  const payload = request.payload;

  parseXml(payload.response)
    .then((s3Response) => {
      if (s3Response.Error) {
        throw s3Response.Error;
      }

      const dataLocation = s3Response.PostResponse.Location[0];
      const key = s3Response.PostResponse.Key[0];
      const dataUrl = `https://${url.parse(dataLocation).host}/${key}`;
      const trialId = request.query.trial_id;
      const userId = (request.auth.credentials || {}).id;

      return new DataContribution({
        trial_id: trialId,
        user_id: userId,
        url: dataUrl,
        comments: payload.comments,
      }).save();
    })
    .then(() => reply.redirect(request.query.redirectTo))
    .catch((err) => {
      const isS3Error = (err.Code && err.Message);
      if (!isS3Error) {
        throw err;
      }

      const errorCode = err.Code[0];
      const errorMessage = err.Message[0];

      reply(Boom.create(payload.responseStatus,
                        errorMessage,
                        { code: errorCode }));
    })
    .catch((err) => {
      reply(Boom.badImplementation('An internal error occurred, please try again later.', err));
    });
}

module.exports = {
  get: {
    handler: _getContributeData,
  },
  post: {
    handler: _postContributeData,
    validate: {
      query: {
        trial_id: Joi.string().guid(),
        redirectTo: Joi.string().default('/'),
      },
      payload: {
        file: Joi.string().empty(''),
        response: Joi.string(),
        responseStatus: Joi.number().integer(),
        comments: Joi.string().empty(''),
        'Content-Type': Joi.string().empty(''),
        key: Joi.string().empty(''),
        acl: Joi.string().empty(''),
        success_action_status: Joi.number().empty(''),
        Policy: Joi.string().empty(''),
        'X-Amz-Algorithm': Joi.string().empty(''),
        'X-Amz-Credential': Joi.string().empty(''),
        'X-Amz-Date': Joi.string().empty(''),
        'X-Amz-Signature': Joi.string().empty(''),
      },
    },
  },
};
