'use strict';

const uuid = require('node-uuid');

function getStats() {
  const stats = {
    trialsCount: 2,
    trialsPerRegistry: [
      {
        registry: 'test',
        count: 2,
      },
    ],
    trialsPerYear: [
      {
        year: 2016,
        count: 4,
      },
    ],
    topLocations: [
      {
        id: uuid.v1(),
        name: 'Location 1',
        count: 2,
      },
    ],
    sourcesLatestUpdatedDate: [
      {
        id: uuid.v1(),
        name: 'Registry',
        latest_updated_date: new Date('2016-01-01'),
      },
    ],
  };

  return stats;
}

module.exports = getStats;
