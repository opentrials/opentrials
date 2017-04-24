'use strict';

const Boom = require('boom');
const config = require('../config');
const s3 = require('../agents/s3');

function data(request, reply) {
  const title = 'Data';
  const description = 'Download a PostgreSQL dump of the entire OpenTrials database.';
  const DUMPS_PREFIX = 'public/opentrials-api';

  s3.listObjects(DUMPS_PREFIX)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Could not get the list of database dumps:', err);
      return {
        Contents: [],
      };
    })
    .then(_parseDumps)
    .then((dumps) => {
      reply.view('data', {
        dumps,
        title,
        description,
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      reply(
        Boom.badGateway('Internal error', err)
      );
    });
}

function _parseDumps(dumps) {
  return (dumps.Contents || []).map((dump) => (
    {
      url: `${config.s3.bucket}/${dump.Key}`,
      label: dump.Key.split('/').pop(),
      size: dump.Size,
    }
  ));
}

module.exports = {
  handler: data,
  cache: {
    expiresIn: 60 * 60 * 24 * 7,  // one week
    privacy: 'private',
  },
};
