/* eslint-disable global-require */

'use strict';

const should = require('should');

describe('routes', () => {
  describe('stripUnknown', () => {
    const originalEnv = Object.assign({}, process.env);

    beforeEach(() => {
      delete require.cache[require.resolve('../../routes')];
    });

    afterEach(() => {
      delete require.cache[require.resolve('../../routes')];
      process.env = originalEnv;
    });

    describe('on production', () => {
      it('is true', () => {
        process.env.NODE_ENV = 'production';
        const routes = require('../../routes');

        routes.forEach((route) => {
          if (route.config && route.config.validate) {
            should(route.config.validate.options.stripUnknown).be.true();
          }
        });
      });
    });

    describe('not on production', () => {
      it('is undefined', () => {
        process.env.NODE_ENV = 'foobar';
        const routes = require('../../routes');

        routes.forEach((route) => {
          if (route.config && route.config.validate && route.config.validate.options) {
            should(route.config.validate.options.stripUnknown).be.undefined();
          }
        });
      });
    });
  });
});
