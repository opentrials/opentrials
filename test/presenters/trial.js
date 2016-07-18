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

      should(trial.documents).be.containDeepOrdered({
        Paperwork: [
          { type: 'blank_case_report_form' },
          { type: 'blank_consent_form' },
          { type: 'patient_information_sheet' },
        ],
        'Regulatory documents': [
          { type: 'csr' },
          { type: 'epar_segment' },
        ],
      });
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
});
