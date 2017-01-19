'use strict';

const revPath = require('../../../views/filters/rev-path');

describe('revPath', () => {
  it('should assert that the path exists', () => {
    (() => (revPath('inexistent-path'))).should.throw();
  });
});
