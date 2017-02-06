'use strict';

const _ = require('lodash');
const uuid = require('node-uuid');
const trialFixture = require('./trials');

function getFDADocument() {
  const documentCategory = {
    name: 'Other',
    id: 2,
  };
  const file = {
    id: uuid.v1(),
    source_url: 'http://example.org/file.pdf',
    documentcloud_id: '1000-sample-file',
    sha1: 'xb82b7092a988bd20dabfd9d4c5fab1fc91c7523',
    pages: [
      {
        text: 'Sed ut perspiciatis unde omnis iste natus',
        num: 1,
      },
      {
        text: 'error sit voluptatem accusantium doloremque laudantium',
        num: 2,
      },
    ],
  };
  const trials = [
    _.pick(trialFixture.getTrial(), ['id', 'url']),
    _.pick(trialFixture.getTrial(), ['id', 'url']),
  ];
  const fdaApproval = {
    id: 'NDA000000-001',
    supplement_number: 1,
    type: 'Approval',
    action_date: '2016-04-06T00:00:00.000Z',
    fda_application: {
      id: 'NDA000000',
      drug_name: 'Heal potion',
      active_ingredients: 'Ginseng',
      url: 'http://example.org/fda_applications/NDA000000',
      type: 'NDA',
    },
  };

  return {
    id: uuid.v1(),
    name: 'Medical review',
    source_url: file.source_url,
    url: 'http://example.org/documents/document_id',
    source_id: 'fda',
    file,
    trials,
    fda_approval: fdaApproval,
    document_category: documentCategory,
  };
}

module.exports = getFDADocument;
