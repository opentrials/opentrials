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
        Data: [
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
        source_url: 'http://somewhere.com/csr.pdf',
      };
      const trial = trialPresenter({
        documents: [
          doc,
        ],
      });

      const regulatoryDocumentsByType = _.groupBy(trial.documents['Regulatory documents'], 'type');
      should(regulatoryDocumentsByType.csr).deepEqual([doc]);
    });

    it('removes documents from the FDA', () => {
      const trial = trialPresenter({
        documents: [
          fixtures.getFDADocument(),
        ],
      });

      Object.keys(trial.documents).forEach((category) => {
        const fdaDocs = _.find(trial.documents[category], { source_id: 'fda' });
        should(fdaDocs).be.undefined();
      });
    });
  });

  describe('fda_documents', () => {
    it('adds documents from the FDA as a separate property', () => {
      const doc = fixtures.getFDADocument();
      const trial = trialPresenter({
        documents: [
          doc,
        ],
      });

      should(trial.fda_documents).have.length(1);
      should(trial.fda_documents[0].id).equal(doc.id);
    });

    it('adds the application ID to the FDA documents', () => {
      const doc = fixtures.getFDADocument();
      const trial = trialPresenter({
        documents: [
          doc,
        ],
      });

      should(trial.fda_documents[0].application_id).equal(doc.fda_approval.fda_application.id);
    });
  });

  describe('records', () => {
    it('sorts records alphabetically by source_id', () => {
      const trialAttributes = {
        records: [
          {
            id: '314912a3-60e5-4056-9ae4-89a37e369ae8',
            source_id: 'ictrp',
            url: 'http://localhost:10010/v1/trials/ee6883be-3414-456c-82aa-91d802a83c98/records/314912a3-60e5-4056-9ae4-89a37e369ae8',
            source_url: 'http://apps.who.int/trialsearch/Trial3.aspx?trialid=EUCTR2010-018661-35-BG',
            updated_at: '2016-03-25T06:03:02.677Z',
          },
          {
            id: '401ef4ea-0dca-4af3-b052-84112b2df8fe',
            source_id: 'euctr',
            url: 'http://localhost:10010/v1/trials/ee6883be-3414-456c-82aa-91d802a83c98/records/401ef4ea-0dca-4af3-b052-84112b2df8fe',
            source_url: 'https://www.clinicaltrialsregister.eu/ctr-search/trial/2010-018662-23/FI',
            updated_at: '2016-05-25T22:45:53.280Z',
          },
          {
            id: '91d1e3eb-e512-47ca-88b9-bb1013e55ef0',
            source_id: 'nct',
            url: 'http://localhost:10010/v1/trials/ee6883be-3414-456c-82aa-91d802a83c98/records/91d1e3eb-e512-47ca-88b9-bb1013e55ef0',
            source_url: 'https://clinicaltrials.gov/ct2/show/NCT01193257',
            updated_at: '2016-02-07T03:26:01.242Z',
          },
        ],
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
        ],
      };

      const trial = trialPresenter(trialAttributes);

      should(trial.publications).deepEqual([
        { source_id: 'pubmed' },
        { source_id: 'nct' },
      ]);
    });

    it('adds HRA publications to the research_summaries set', () => {
      const trialAttributes = {
        publications: [
          { source_id: 'hra' },
          { source_id: 'pubmed' },
          { source_id: 'nct' },
        ],
      };

      const trial = trialPresenter(trialAttributes);

      should(trial.research_summaries).deepEqual([
          { source_id: 'hra' },
      ]);
    });
  });

  describe('discrepancies', () => {
    it('adds the record\'s source_url', () => {
      const trialAttributes = {
        records: [
          {
            id: '3e5ffed2-5a62-4a99-ba4c-e616567ccdaf',
            source_url: 'http://example.org/record1',
          },
          {
            id: '4755e93d-14d4-4bc0-98a5-51196637e45b',
            source_url: 'http://example.org/record2',
          },
        ],
        discrepancies: {
          status: [
            {
              record_id: '3e5ffed2-5a62-4a99-ba4c-e616567ccdaf',
              value: 'ongoing',
            },
            {
              record_id: '4755e93d-14d4-4bc0-98a5-51196637e45b',
              value: 'complete',
            },
          ],
        },
      };

      const trial = trialPresenter(trialAttributes);

      const discrepanciesSourcesUrls = trial.discrepancies.status.map((d) => d.source_url);
      const expectedSourcesUrls = trialAttributes.records.map((record) => record.source_url);
      should(discrepanciesSourcesUrls).deepEqual(expectedSourcesUrls);
    });

    it('returns undefined if there are no discrepancies', () => {
      const trialAttributes = {
        records: [
          {
            id: '3e5ffed2-5a62-4a99-ba4c-e616567ccdaf',
            source_url: 'http://example.org/record1',
          },
        ],
      };

      const trial = trialPresenter(trialAttributes);
      should(trial.discrepancies).be.undefined();
    });
  });

  describe('risks_of_bias', () => {
    it('generates the expected risk of bias message', () => {
      const trialAttributes = {
        risks_of_bias: [
          {
            id: '4a592278-8c98-11e6-aad1-f8165487599c',
            trial_id: 'a63246de-1329-4532-b805-140b9065e379',
            source_id: 'cochrane',
            study_id: 'STD-Bachmann-2003',
            source_url: 'http://onlinelibrary.wiley.com/doi/10.1002/14651858.CD006918.pub2/full',
            risk_of_bias_criteria: [
              {
                id: '4a5a46ee-8c98-11e6-aad1-f8165487599c',
                name: 'sequence generation',
                value: 'yes',
              },
              {
                id: '4a5b9620-8c98-11e6-aad1-f8165487599c',
                name: 'allocation concealment',
                value: 'unknown',
              },
              {
                id: '4a5cd5e4-8c98-11e6-aad1-f8165487599c',
                name: 'blinding (performance and/or detection)',
                value: 'yes',
              },
              {
                id: '4a5e2f34-8c98-11e6-aad1-f8165487599c',
                name: 'attrition',
                value: 'yes',
              },
              {
                id: '4a5f204c-8c98-11e6-aad1-f8165487599c',
                name: 'reporting',
                value: 'yes',
              },
              {
                id: '4a5ffae4-8c98-11e6-aad1-f8165487599c',
                name: 'other biases',
                value: 'no',
              },
            ],
            created_at: '2016-10-07T13:13:59.160Z',
            updated_at: '2016-10-07T13:13:59.160Z',
          },
        ],
      };
      const expectedMessage = (
          '"low risk" of bias for "sequence generation"' +
          ', "unclear" for "allocation concealment"' +
          ', "low risk" of bias for "blinding (performance and/or detection)"' +
          ', "low risk" of bias for "attrition"' +
          ', "low risk" of bias for "reporting"' +
          ', and "high risk" of bias for "other biases"'
      );

      const trial = trialPresenter(trialAttributes);

      should(trial.risks_of_bias[0].message).equal(expectedMessage);
    });
  });

  describe('last_verified', () => {
    it('returns the date from primary record', () => {
      const trialAttributes = {
        records: [
          {
            id: '3e5ffed2-5a62-4a99-ba4c-e616567ccdaf',
            is_primary: true,
            last_verification_date: '2001-04-30T00:00:00.000Z',
          },
          {
            id: '4755e93d-14d4-4bc0-98a5-51196637e45b',
            is_primary: false,
            last_verification_date: '2001-05-35T00:00:00.000Z',
          },
        ],
      };

      const trial = trialPresenter(trialAttributes);
      const expectedDate = new Date(trialAttributes.records[0].last_verification_date).toISOString();
      should(trial.last_verified.toISOString()).equal(expectedDate);
    });

    it('returns the most recent date if there are several primary records', () => {
      const trialAttributes = {
        records: [
          {
            id: '3e5ffed2-5a62-4a99-ba4c-e616567ccdaf',
            is_primary: true,
            last_verification_date: '2001-04-30T00:00:00.000Z',
          },
          {
            id: '4755e93d-14d4-4bc0-98a5-51196637e45b',
            is_primary: true,
            last_verification_date: '2001-05-30T00:00:00.000Z',
          },
        ],
      };

      const trial = trialPresenter(trialAttributes);
      const expectedDate = new Date(trialAttributes.records[1].last_verification_date).toISOString();
      should(trial.last_verified.toISOString()).equal(expectedDate);
    });

    it('return null if last_verification_date is null', () => {
      const trialAttributes = {
        records: [
          {
            id: '3e5ffed2-5a62-4a99-ba4c-e616567ccdaf',
            is_primary: true,
            last_verification_date: null,
          },
        ],
      };

      const trial = trialPresenter(trialAttributes);
      should(trial.last_verified).equal(null);
    });

    it('return null if there is no primary record', () => {
      const trialAttributes = {
        records: [
          {
            id: '3e5ffed2-5a62-4a99-ba4c-e616567ccdaf',
            is_primary: false,
            last_verification_date: '2001-05-30T00:00:00.000Z',
          },
        ],
      };

      const trial = trialPresenter(trialAttributes);
      should(trial.last_verified).equal(null);
    });
  });
});
