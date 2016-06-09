'use strict';

const should = require('should');
const formatDate = require('../../../views/filters/format-date');

describe('formatDate', () => {
  it('formats date as DD/MMM/YYYY', () => {
    const date = new Date('2016/04/20');
    formatDate(date).should.eql('20/Apr/2016');
  });

  it('returns undefined when called with undefined', () => {
    should(formatDate(undefined)).be.undefined();
  });
});
