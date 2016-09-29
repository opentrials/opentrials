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

  describe('records', () => {
    it('sorts records alphabetically by source_id', () => {
      const trialAttributes = {
        records: [
          {
            "id": "314912a3-60e5-4056-9ae4-89a37e369ae8",
            "source_id": "ictrp",
            "url": "http://localhost:10010/v1/trials/ee6883be-3414-456c-82aa-91d802a83c98/records/314912a3-60e5-4056-9ae4-89a37e369ae8",
            "source_url": "http://apps.who.int/trialsearch/Trial3.aspx?trialid=EUCTR2010-018661-35-BG",
            "updated_at": "2016-03-25T06:03:02.677Z"
          },
          {
            "id": "401ef4ea-0dca-4af3-b052-84112b2df8fe",
            "source_id": "euctr",
            "url": "http://localhost:10010/v1/trials/ee6883be-3414-456c-82aa-91d802a83c98/records/401ef4ea-0dca-4af3-b052-84112b2df8fe",
            "source_url": "https://www.clinicaltrialsregister.eu/ctr-search/trial/2010-018662-23/FI",
            "updated_at": "2016-05-25T22:45:53.280Z"
          },
          {
            "id": "91d1e3eb-e512-47ca-88b9-bb1013e55ef0",
            "source_id": "nct",
            "url": "http://localhost:10010/v1/trials/ee6883be-3414-456c-82aa-91d802a83c98/records/91d1e3eb-e512-47ca-88b9-bb1013e55ef0",
            "source_url": "https://clinicaltrials.gov/ct2/show/NCT01193257",
            "updated_at": "2016-02-07T03:26:01.242Z"
          },
        ]
      };
      const trial = trialPresenter(trialAttributes);
      const recordsSources = trial.records.map((record) => record.source_id);
      should(recordsSources).deepEqual(['euctr', 'ictrp', 'nct']);
    });

    it('works if there are no records', () => {
      const trialAttributes = {};
      const trial = trialPresenter(trialAttributes);
      should(trial.records).deepEqual([]);
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

  describe('publications', () => {
    it('does not add HRA publications to the publications set', () => {
      const trialAttributes = {
        publications: [
          { source_id: 'hra' },
          { source_id: 'pubmed' },
          { source_id: 'nct' },
        ]
      };

      const trial = trialPresenter(trialAttributes);

      should(trial.publications).deepEqual([
        { source_id: 'pubmed' },
        { source_id: 'nct' },
      ]);
    })

    it('adds HRA publications to the research_summaries set', () => {
      const trialAttributes = {
        publications: [
          { source_id: 'hra' },
          { source_id: 'pubmed' },
          { source_id: 'nct' },
        ]
      };

      const trial = trialPresenter(trialAttributes);

      should(trial.research_summaries).deepEqual([
          { source_id: 'hra' },
      ]);
    })
  });
});
