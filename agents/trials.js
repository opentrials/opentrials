'use strict';

const _ = require('lodash');
const opentrialsApi = require('../config').opentrialsApi;

function getTrial(trialId) {
  return opentrialsApi
    .then((client) => client.trials.get({ id: trialId }))
    .then((response) => response.obj);
}

function getRecord(id, trialId) {
  return opentrialsApi
    .then((client) => client.trials.getRecord({ trialId, id }))
    .then((response) => response.obj);
}

function getRecords(id) {
  return opentrialsApi
    .then((client) => client.trials.getRecords({ id }))
    .then((response) => response.obj);
}

function getDiscrepancies(id) {
  function recordsToDiscrepancies(records) {
    const fields = [
      'public_title',
      'brief_summary',
      'target_sample_size',
      'gender',
      'registration_date',
    ];

    const fieldsDiscrepancies = fields.map((field) => {
      const values = records.reduce((result, record) => {
        if (record[field] !== undefined) {
          result.push({
            source_name: record.source.name,
            id: record.id,
            value: record[field],
          });
        }

        return result;
      }, []);

      return { field, records: values };
    });

    return fieldsDiscrepancies.filter((fieldDiscrepancies) => {
      // Have to convert to JSON to handle values that normally aren't
      // comparable like dates.
      const cleanRecords = JSON.parse(JSON.stringify(fieldDiscrepancies.records));
      return _.uniqBy(cleanRecords, 'value').length > 1;
    });
  }

  return getRecords(id)
    .then((records) => recordsToDiscrepancies(records));
}

function generateQueryString(query, filters) {
  const queryValues = Object.keys(filters || {}).reduce((prev, filterName) => {
    let value = filters[filterName];
    let result = prev;

    if (value) {
      if (!Array.isArray(value)) {
        value = [value];
      }
      value = `${filterName}:(${value.join(' OR ')})`;

      result = result.concat(value);
    }

    return result;
  }, []).join(' AND ');

  let queryString;
  if (query) {
    if (queryValues) {
      queryString = `(${query}) AND ${queryValues}`;
    } else {
      queryString = query;
    }
  } else {
    queryString = queryValues || undefined;
  }

  return queryString;
}

function searchTrials(query, page, perPage, filters) {
  const searchQuery = {
    q: generateQueryString(query, filters),
    page,
    per_page: perPage,
  };

  return opentrialsApi
    .then((client) => client.trials.search(searchQuery))
    .then((response) => response.obj);
}

function searchTrialsByEntity(entityType, entityName) {
  return searchTrials(`${entityType}:"${entityName.replace('"', '\\"')}"`, 1, 10);
}

module.exports = {
  get: getTrial,
  search: searchTrials,
  searchByEntity: searchTrialsByEntity,
  getRecord,
  getRecords,
  getDiscrepancies,
};
