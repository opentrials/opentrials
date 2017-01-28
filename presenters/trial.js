'use strict';

const _ = require('lodash');

function decorateDocuments(documents) {
  const nonFDADocuments = _.filter(documents, (doc) => doc.source_id !== 'fda');
  const documentsDefaultGroup = _.remove(nonFDADocuments, (doc) =>
    _.isUndefined(doc.document_category.group)
  );
  const groupedDocuments = _.groupBy(nonFDADocuments, (doc) =>
    doc.document_category.group
  );
  if (documentsDefaultGroup.length > 0) {
    groupedDocuments.Other = documentsDefaultGroup;
  }
  return groupedDocuments;
}

function decorateFDADocuments(documents) {
  const fdaDocs = _.filter(documents, (doc) => doc.source_id === 'fda');
  return fdaDocs.map((doc) => {
    let applicationId;
    if (_.has(doc, 'fda_approval') && _.has(doc, 'fda_approval.fda_application')) {
      applicationId = doc.fda_approval.fda_application.id;
    }
    return _.set(doc, 'application_id', applicationId);
  });
}

function decorateRecords(records) {
  return _.sortBy(records, 'source_id');
}

function decorateLastVerified(records) {
  const primaryRecords = _.filter(records, (rec) => rec.is_primary && rec.last_verification_date);
  const sortedRecords = _.orderBy(primaryRecords, ['last_verification_date'], ['desc']);
  const lastVerified = sortedRecords[0];
  let lastVerifiedDate = null;
  if (lastVerified) {
    lastVerifiedDate = new Date(lastVerified.last_verification_date);
  }
  return lastVerifiedDate;
}

function decorateIdentifiers(identifiers, sources) {
  const result = Object.keys(identifiers).map((ident) => {
    const source = sources[ident] || {};

    return {
      id: ident,
      name: source.name || ident,
      value: identifiers[ident],
    };
  });

  return _.sortBy(result, 'name');
}

function decoratePublications(publications) {
  return _.filter(publications, (p) => p.source_id !== 'hra');
}

function decorateResearchSummaries(publications) {
  return _.filter(publications, (p) => p.source_id === 'hra');
}

function decorateDiscrepancies(discrepancies, records) {
  let decoratedDiscrepancies = {};
  const recordsById = _.groupBy(records, 'id');

  for (const key of Object.keys(discrepancies)) {
    decoratedDiscrepancies[key] = discrepancies[key].map((discrepancy) => {
      const record = recordsById[discrepancy.record_id][0];
      const sourceUrl = record.source_url;
      return Object.assign({}, discrepancy, { source_url: sourceUrl });
    });
  }

  if (_.isEmpty(decoratedDiscrepancies)) {
    decoratedDiscrepancies = undefined;
  }
  return decoratedDiscrepancies;
}

function decorateRisksOfBias(risksOfBias) {
  return risksOfBias.map((rob) => {
    const messages = rob.risk_of_bias_criteria.map((criteria) => {
      let msg;

      switch (criteria.value) {
        case 'yes':
          msg = '"low risk" of bias';
          break;
        case 'no':
          msg = '"high risk" of bias';
          break;
        default:
          msg = '"unclear"';
          break;
      }

      return `${msg} for "${criteria.name}"`;
    });

    if (messages.length >= 2) {
      const lastIndex = (messages.length - 1);
      messages[lastIndex] = `and ${messages[lastIndex]}`;
    }

    return Object.assign(
      {},
      rob,
      {
        message: messages.join(', '),
      }
    );
  });
}

function decorateTrial(trial) {
  return Object.assign(
    {},
    trial,
    {
      documents: decorateDocuments(trial.documents || []),
      fda_documents: decorateFDADocuments(trial.documents || []),
      identifiers: decorateIdentifiers(trial.identifiers || {}, trial.sources || {}),
      records: decorateRecords(trial.records || []),
      publications: decoratePublications(trial.publications || []),
      research_summaries: decorateResearchSummaries(trial.publications || []),
      discrepancies: decorateDiscrepancies(trial.discrepancies || {}, trial.records || []),
      risks_of_bias: decorateRisksOfBias(trial.risks_of_bias || []),
      last_verified: decorateLastVerified(trial.records || []),
    }
  );
}

module.exports = decorateTrial;
