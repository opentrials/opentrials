/* eslint-disable global-require */

'use strict';

const plugins = {
  addFlashMessagesToContext: require('./plugins/add-flash-messages-to-context'),
  addCurrentURLToContext: require('./plugins/add-current-url-to-context'),
  httpErrorHandler: require('./plugins/http-error-handler'),
  sendErrorsToSentry: require('./plugins/send-errors-to-sentry'),
  sendEmailWithMandrill: require('./plugins/send-email-with-mandrill'),
};

module.exports = plugins;
