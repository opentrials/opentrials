'use strict';

const yar = require('yar');

module.exports = {
  register: yar,
  options: {
    storeBlank: false,
    cookieOptions: {
      password: process.env.SESSION_PASSWORD,
      isSecure: false,  // FIXME: Set to true in production when issue #100 is fixed
    },
  },
};
