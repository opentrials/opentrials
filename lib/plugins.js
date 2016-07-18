'use strict';

const plugins = {
  addFlashMessagesToContext: require('./plugins/add-flash-messages-to-context'),
  httpErrorHandler: require('./plugins/http-error-handler'),
};

module.exports = plugins;
