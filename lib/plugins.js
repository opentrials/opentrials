/* eslint-disable global-require */

'use strict';

const plugins = {
  addFlashMessagesToContext: require('./plugins/add-flash-messages-to-context'),
  addCurrentURLToContext: require('./plugins/add-current-url-to-context'),
  httpErrorHandler: require('./plugins/http-error-handler'),
  sendErrorsToSentry: require('./plugins/send-errors-to-sentry'),
  sendEmail: require('./plugins/send-email'),
  yar: require('./plugins/yar'),
};

module.exports = plugins;
