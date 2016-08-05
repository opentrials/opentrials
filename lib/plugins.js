'use strict';

const plugins = {
  addFlashMessagesToContext: require('./plugins/add-flash-messages-to-context'),
  addCurrentURLToContext: require('./plugins/add-current-url-to-context'),
  httpErrorHandler: require('./plugins/http-error-handler'),
};

module.exports = plugins;
