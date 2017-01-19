'use strict';

const gravatar = require('../../../views/filters/gravatar');

describe('gravatar', () => {
  it('returns the correct url with size 22', () => {
    const email = 'foo@bar.com';
    gravatar(email).should.eql('//www.gravatar.com/avatar/f3ada405ce890b6f8204094deb12d8a8?size=22');
  });
});
