const fixtures = {
  getCondition: require('./conditions'),
  getPerson: require('./persons'),
  getOrganisation: require('./organisations'),
  getIntervention: require('./interventions'),
  getTrial: require('./trials').getTrial,
  getRecord: require('./trials').getRecord,
  searchTrialsByEntity: require('./trials').searchTrialsByEntity,
  getLocation: require('./locations'),
  getStats: require('./stats'),
}

module.exports = fixtures;
