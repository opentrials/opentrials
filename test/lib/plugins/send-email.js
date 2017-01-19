'use strict';

const sendEmail = require('../../../lib/plugins').sendEmail;

describe('sendEmail', () => {
  describe('composeEmail', () => {
    it('returns an email object', () => {
      const context = { testID: 'f66063b0-c7bc-11e6-98e4-031c0647e98f' };
      const email = sendEmail.composeEmail('test.md', context);
      const expectedAttachment = { data: `<p>${context.testID}</p>\n`, alternative: true };

      email.text.should.equal(`${context.testID}\n`);
      email.attachment.should.deepEqual([expectedAttachment]);
      email.should.have.properties(['from', 'to', 'subject']);
    });
  });
});
