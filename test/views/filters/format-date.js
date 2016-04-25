const formatDate = require('../../../views/filters/format-date');

describe('formatDate', () => {
  it('formats date ad DD/MMM/YYYY', () => {
    const date = new Date('2016-04-20');
    formatDate(date).should.eql('20/Apr/2016');
  });
});
