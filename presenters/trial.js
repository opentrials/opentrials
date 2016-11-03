'use strict';

const _ = require('lodash');

function decorateDocuments(documents) {
  const documentTypesCategories = {
    // paperwork
    blank_consent_form: 'Paperwork',
    patient_information_sheet: 'Paperwork',
    blank_case_report_form: 'Paperwork',
    // regulatory
    csr: 'Regulatory documents',
    csr_synopsis: 'Regulatory documents',
    epar_segment: 'Regulatory documents',
    // data
    results: 'Data',
  };
  const defaultDocuments = {
    blank_consent_form: {
      type: 'blank_consent_form',
      name: 'Blank consent form',
    },
    patient_information_sheet: {
      type: 'patient_information_sheet',
      name: 'Patient information sheet',
    },
    blank_case_report_form: {
      type: 'blank_case_report_form',
      name: 'Blank case report form',
    },
    csr: {
      type: 'csr',
      name: 'Clinical study report',
    },
    epar_segment: {
      type: 'epar_segment',
      name: 'EPAR Segment',
    },
    results: {
      type: 'results',
      name: 'Results',
    },
  };

  const nonFDADocuments = _.filter(documents, (doc) => doc.source_id !== 'fda');

  const unknownDocuments = Object.assign({}, defaultDocuments);
  nonFDADocuments.forEach((doc) => delete unknownDocuments[doc.type]);

  const allDocuments = _.values(unknownDocuments).concat(nonFDADocuments);
  const documentsByCategory = _.groupBy(allDocuments,
                                        (doc) => documentTypesCategories[doc.type]);

  Object.keys(documentsByCategory).forEach((category) => {
    documentsByCategory[category] = _.sortBy(documentsByCategory[category], 'type');
  });

  return documentsByCategory;
}

function decorateRecords(records) {
  return _.sortBy(records, 'source_id');
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
  const decoratedDiscrepancies = {};
  const recordsById = _.groupBy(records, 'id');

  for (const key of Object.keys(discrepancies)) {
    decoratedDiscrepancies[key] = discrepancies[key].map((discrepancy) => {
      const record = recordsById[discrepancy.record_id][0];
      const sourceUrl = record.source_url;
      return Object.assign({}, discrepancy, { source_url: sourceUrl });
    });
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
      identifiers: decorateIdentifiers(trial.identifiers || {}, trial.sources || {}),
      records: decorateRecords(trial.records || []),
      publications: decoratePublications(trial.publications || []),
      research_summaries: decorateResearchSummaries(trial.publications || []),
      discrepancies: decorateDiscrepancies(trial.discrepancies || {}, trial.records || []),
      risks_of_bias: decorateRisksOfBias(trial.risks_of_bias || []),
    }
  );
}

module.exports = decorateTrial;
