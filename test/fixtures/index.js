const fixtures = {
  getProblem: require('./problems'),
  getPerson: require('./persons'),
  getOrganisation: require('./organisations'),
  getIntervention: require('./interventions'),
  getTrial: require('./trials').getTrial,
  getRecord: require('./trials').getRecord,
  getLocation: require('./locations'),
}

module.exports = fixtures;
