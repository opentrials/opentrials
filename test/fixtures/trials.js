const uuid = require('node-uuid');

function getTrial() {
  const trial = {
    id: uuid.v1(),
    primary_register: 'primary_register',
    primary_id: 'primary_id',
    secondary_ids: JSON.stringify([]),
    registration_date: new Date('2016-01-01'),
    public_title: 'public_title',
    brief_summary: 'brief_summary',
    recruitment_status: 'recruitment_status',
    eligibility_criteria: JSON.stringify('[]'),
    study_type: 'study_type',
    study_design: 'study_design',
    study_phase: 'study_phase',
  };

  return trial;
}

function getRecord() {
  const record = {
    id: uuid.v1(),
    trial_id: uuid.v1(),
    source: {
      id: uuid.v1(),
      name: 'nct',
      type: 'register',
    },
    source_url: 'https://clinicaltrials.gov/ct2/show/NCT00000000',
    source_data: {
      foo: 'bar',
    },
    public_title: 'public_title',
    brief_summary: 'brief_summary',
    target_sample_size: 200,
    registration_date: new Date('2016-01-01'),
    created_at: new Date('2016-01-01'),
    updated_at: new Date('2016-02-01'),
  };
  record.trial_url = `http://api.opentrials.net/v1/trials/${record.trial_id}`;
  record.url = `${record.trial_url}/records/${record.id}`;

  return record;
}

module.exports = {
  getTrial,
  getRecord,
};
