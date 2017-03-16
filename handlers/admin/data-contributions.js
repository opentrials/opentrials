'use strict';

const Joi = require('joi');
const Promise = require('bluebird');
const DataContribution = require('../../models/data-contribution');
const documentCategories = require('../../agents/document_categories');


function editDataContribution(request, reply) {
  const data = {
    approved: request.payload.approved,
    trial_id: request.payload.trial_id,
    document_category_id: request.payload.document_category_id,
    curation_comments: request.payload.curation_comments,
  };

  return new DataContribution({ id: request.params.id })
    .save(data, { patch: true, require: true })
    .then(() => {
      request.yar.flash('success', 'Data Contribution updated successfully.');
      return reply.redirect('/admin/data-contributions');
    })
    .catch((error) => {
      console.error(error.detail); // eslint-disable-line no-console
      request.yar.flash('error', 'An internal error occurred, please try again later.');
      return reply.redirect('/admin/data-contributions');
    });
}

function listDataContributions(request, reply) {
  const fetchCategories = documentCategories.list();
  const fetchContributions = new DataContribution()
        .query('orderBy', 'created_at', 'desc')
        .fetchAll({ withRelated: DataContribution.relatedModels });

  return Promise.join(
    fetchCategories,
    fetchContributions,
    (categories, dataContributions) => {
      reply.view('admin/data-contributions', {
        title: 'Data contributions',
        categories: categories.items,
        dataContributions: dataContributions.toJSON(),
      });
    }
  );
}

module.exports = {
  get: {
    handler: listDataContributions,
    auth: {
      mode: 'required',
      scope: ['curator', 'admin'],
    },
  },
  post: {
    handler: editDataContribution,
    auth: {
      mode: 'required',
      scope: ['curator', 'admin'],
    },
    validate: {
      query: {
        id: Joi.string().guid(),
      },
      payload: {
        trial_id: Joi.string().trim().guid().empty(''),
        document_category_id: Joi.number().integer(),
        curation_comments: Joi.string().trim().empty(''),
        approved: Joi.boolean(),
      },
    },
  },
};
