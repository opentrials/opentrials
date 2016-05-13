'use strict';

const factory = require('factory-girl').promisify(require('bluebird'));
require('factory-girl-bookshelf')();
const uuid = require('node-uuid');
const User = require('../models/user');
const OAuthCredential = require('../models/oauth-credential');
const DataContribution = require('../models/data-contribution');

factory.define('user', User, {
  id: () => uuid.v1(),
  name: factory.sequence((n) => `user${n}`),
  email: factory.sequence((n) => `user${n}@foo.com`),
}, {
  afterCreate: (user, attrs, callback) => {
    factory.create('oauthCredential', { user_id: user.attributes.id }, (err) => {
      if (err) {
        callback(err);
      } else {
        new User({ id: user.id })
          .fetch({ withRelated: 'oauthCredentials' })
          .then((instance) => callback(null, instance))
          .catch((_err) => callback(_err));
      }
    });
  },
});

factory.define('oauthCredential', OAuthCredential, {
  provider: 'google',
  id: factory.sequence((n) => `${n}`),
  user_id: factory.assoc('user', 'id'),
});

factory.define('dataContribution', DataContribution, {
  id: () => uuid.v1(),
  user_id: factory.assoc('user', 'id'),
  trial_id: () => uuid.v1(),
  url: factory.sequence((n) => `http://opentrials-test.s3.amazonaws.com/uploads/${uuid.v1()}/file-${n}.pdf`),
  comments: factory.sequence((n) => `Data upload ${n}`),
});

module.exports = factory;
