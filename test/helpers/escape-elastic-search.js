'use strict';

const should = require('should');
const escapeElasticSearch = require('../../helpers/escape-elastic-search');

describe('escapeElasticSearch', () => {
  it('escapes (1+1):2 correctly', () => {
    const input = '(1+1):2';
    const output = '\\(1\\+1\\)\\:2';

    escapeElasticSearch(input).should.eql(output);
  });

  it('escapes all special characters', () => {
    // List taken from
    // http://lucene.apache.org/core/6_0_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#Escaping%20Special%20Characters
    const input = '+ - && || ! ( ) { } [ ] ^ " ~ * ? : \\ /';
    const output = '\\+ \\- \\&& \\|| \\! \\( \\) \\{ \\} \\[ \\] \\^ \\" \\~ \\* \\? \\: \\\\ \\/';

    escapeElasticSearch(input).should.eql(output);
  });

  it('doesn\'t escape whitespaces', () => {
    const input = ' \t ';
    const output = input;

    escapeElasticSearch(input).should.eql(output);
  });

  it('doesn\'t escape AND, OR or NOT', () => {
    const input = 'AND OR NOT';
    const output = input;

    escapeElasticSearch(input).should.eql(output);
  });

  it('returns undefined if called with undefined', () => {
    should(escapeElasticSearch(undefined)).be.undefined();
  });
});
