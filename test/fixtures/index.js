const fixtures = {
  getCondition: require('./conditions'),
  getPerson: require('./persons'),
  getSource: require('./sources'),
  getOrganisation: require('./organisations'),
  getIntervention: require('./interventions'),
  getTrial: require('./trials').getTrial,
  searchTrialsByEntity: require('./trials').searchTrialsByEntity,
  getLocation: require('./locations'),
  getStats: require('./stats'),
  getFDADocument: require('./fda_documents'),
}

module.exports = fixtures;
