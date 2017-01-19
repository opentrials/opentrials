'use strict';

const should = require('should');
const underscoresToCapitalized = require('../../../views/filters/underscores-to-capitalized');

describe('underscoresToCapitalized', () => {
  it('should convert underscores to whitespaces and capitalize first letter', () => {
    underscoresToCapitalized('foo_bar_baz').should.eql('Foo bar baz');
  });

  it('should capitalize the first letter', () => {
    underscoresToCapitalized('foo bar baz').should.eql('Foo bar baz');
  });

  it('should work with a single character', () => {
    underscoresToCapitalized('a').should.eql('A');
  });

  it('should return empty string if received empty string', () => {
    underscoresToCapitalized('').should.eql('');
  });

  it('should return undefined if received undefined', () => {
    should(underscoresToCapitalized(undefined)).be.undefined();
  });
});
