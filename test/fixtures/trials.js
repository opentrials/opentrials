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

module.exports = getTrial;
