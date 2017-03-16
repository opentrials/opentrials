'use strict';

const yar = require('yar');

module.exports = {
  register: yar,
  options: {
    storeBlank: false,
    cookieOptions: {
      password: process.env.SESSION_PASSWORD,
      isSecure: process.env.NODE_ENV === 'production',
    },
  },
};
