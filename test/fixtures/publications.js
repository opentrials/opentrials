const uuid = require('node-uuid');

function getPublication() {
  const publication = {
    id: uuid.v1(),
    title: 'test publication',
    source: {
      id: uuid.v1(),
      name: 'nct',
      type: 'register',
    },
    source_url: 'https://clinicaltrials.gov/ct2/show/NCT00000000',
    created_at: new Date('2016-01-01'),
    updated_at: new Date('2016-02-01'),
  };

  return publication;
}

module.exports = getPublication;
