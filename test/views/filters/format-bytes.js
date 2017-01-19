'use strict';

const should = require('should');
const formatBytes = require('../../../views/filters/format-bytes');

describe('formatBytes', () => {
  const testCases = [
    { input: 0, output: '0 B' },
    { input: 1150, output: '1.1 KB' },
    { input: 1024, output: '1 KB' },
    { input: Math.pow(1024, 2), output: '1 MB' },
    { input: Math.pow(1024, 3), output: '1 GB' },
    { input: Math.pow(1024, 4), output: '1 TB' },
    { input: Math.pow(1024, 5), output: '1 PB' },
  ];

  testCases.forEach((testCase) => {
    it(`returns ${testCase.output} when called with ${testCase.input}`, () => {
      should(formatBytes(testCase.input)).eql(testCase.output);
    });
  });
});
