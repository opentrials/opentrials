'use strict';

const should = require('should');
const formatNumber = require('../../../views/filters/format-number');

describe('formatNumber', () => {
  it('formats numbers as 99,999.99', () => {
    const number = 99999.99;
    formatNumber(number).should.eql('99,999.99');
  });

  it('returns undefined when called with undefined', () => {
    should(formatNumber(undefined)).be.undefined();
  });
});
