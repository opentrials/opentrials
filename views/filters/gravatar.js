'use strict';

const gravatar = require('gravatar');

function generateGravatarUrl(email) {
  return gravatar.url(email, { size: 22 });
}

module.exports = generateGravatarUrl;
