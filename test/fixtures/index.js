'use strict';

const getCondition = require('./conditions');
const getPerson = require('./persons');
const getSource = require('./sources');
const getOrganisation = require('./organisations');
const getIntervention = require('./interventions');
const getTrial = require('./trials').getTrial;
const searchTrialsByEntity = require('./trials').searchTrialsByEntity;
const getLocation = require('./locations');
const getStats = require('./stats');
const getFDADocument = require('./fda_documents');

const fixtures = {
  getCondition,
  getPerson,
  getSource,
  getOrganisation,
  getIntervention,
  getTrial,
  searchTrialsByEntity,
  getLocation,
  getStats,
  getFDADocument,
};

module.exports = fixtures;
