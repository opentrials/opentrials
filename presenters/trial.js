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

  const unknownDocuments = Object.assign({}, defaultDocuments);
  documents.forEach((doc) => delete unknownDocuments[doc.type]);

  const allDocuments = _.values(unknownDocuments).concat(documents);
  const documentsByCategory = _.groupBy(allDocuments,
                                        (doc) => documentTypesCategories[doc.type]);

  Object.keys(documentsByCategory).forEach((category) => {
    documentsByCategory[category] = _.sortBy(documentsByCategory[category], 'type');
  });

  return documentsByCategory;
}

function decorateTrial(trial) {
  return Object.assign(
    {},
    trial,
    {
      documents: decorateDocuments(trial.documents || []),
    }
  );
}

module.exports = decorateTrial;
