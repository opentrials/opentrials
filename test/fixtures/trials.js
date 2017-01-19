'use strict';

const uuid = require('node-uuid');

function getTrial() {
  const trial = {
    id: uuid.v1(),
    registration_date: new Date('2016-01-01'),
    public_title: 'public_title',
    brief_summary: 'brief_summary',
    status: 'ongoing',
    recruitment_status: 'recruiting',
    eligibility_criteria: JSON.stringify('[]'),
    study_type: 'study_type',
    study_design: 'study_design',
    study_phase: 'study_phase',
    gender: 'both',
    identifiers: { nct: 'NCT00000000', isrctn: 'ISRCTN0000000' },
    source_id: 'nct',
  };

  return trial;
}

function searchTrialsByEntity() {
  const trials = {
    total_count: 1,
    items: [
      {
        id: uuid.v1(),
        identifiers: {},
        public_title: 'a public title',
        brief_summary: 'a brief summaty',
        target_sample_size: 2000,
        gender: 'both',
        has_published_results: true,
        registration_date: '1999-11-02T00:00:00.000Z',
      },
    ],
  };
  trials.items[0].url = `http://api.opentrials.net/v1/trials/${trials.items[0].id}`;

  return trials;
}

module.exports = {
  getTrial,
  searchTrialsByEntity,
};
