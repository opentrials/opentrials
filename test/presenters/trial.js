'use strict';

const should = require('should');
const _ = require('lodash');
const trialPresenter = require('../../presenters/trial');

describe('trial presenter', () => {
  it('keeps the original attributes', () => {
    const attributes = { foo: 'bar' };
    const trial = trialPresenter(attributes);

    should(trial).containDeep(attributes);
  });

  describe('documents', () => {
    it('adds default documents grouped by category and ordered by type', () => {
      const trial = trialPresenter({});
      const expectedDocumentTypes = {
        Paperwork: [
          'blank_case_report_form',
          'blank_consent_form',
          'patient_information_sheet',
        ],
        'Regulatory documents': [
          'csr',
          'epar_segment',
        ],
        'Data': [
          'results',
        ],
      };

      Object.keys(expectedDocumentTypes).forEach((category) => {
        const documentTypes = trial.documents[category].map((doc) => doc.type);
        const expected = expectedDocumentTypes[category];

        should(documentTypes).deepEqual(expected);
      });
      should(Object.keys(trial.documents)).deepEqual(Object.keys(expectedDocumentTypes));
    });

    it('documents in the trial overwrite default documents', () => {
      const doc = {
        type: 'csr',
        name: 'Clinical Study Report',
        url: 'http://somewhere.com/csr.pdf',
      };
      const trial = trialPresenter({
        documents: [
          doc,
        ],
      });

      const regulatoryDocumentsByType = _.groupBy(trial.documents['Regulatory documents'], 'type');
      should(regulatoryDocumentsByType.csr).deepEqual([doc]);
    });
  });

  describe('identifiers', () => {
    it('adds identifiers with source metadata sorted by source name', () => {
      const trialAttributes = {
        identifiers: {
          isrctn: 'ISRCTN00000',
          nct: 'NCT000000',
        },
        sources: {
          isrctn: {
            id: 'isrctn',
            name: 'ISRCTN',
          },
          euctr: {
            id: 'euctr',
            name: 'EU CTR',
          },
          nct: {
            id: 'nct',
            name: 'ClinicalTrials.gov',
          },
        },
      };
      const trial = trialPresenter(trialAttributes);

      should(trial.identifiers).deepEqual([
        { id: 'nct', name: 'ClinicalTrials.gov', value: trialAttributes.identifiers.nct },
        { id: 'isrctn', name: 'ISRCTN', value: trialAttributes.identifiers.isrctn },
      ]);
    });

    it('defaults to the source id if the source doesnt exist', () => {
      const trialAttributes = {
        identifiers: {
          nct: 'NCT00000',
        },
      };

      const trial = trialPresenter(trialAttributes);

      should(trial.identifiers).deepEqual([{
        id: 'nct',
        name: 'nct',
        value: trialAttributes.identifiers.nct,
      }]);
    });
  });
});
