'use strict';

const DataContribution = require('../../models/data-contribution');


function dataCuration(request, reply) {
  new DataContribution()
    .query('orderBy', 'created_at', 'desc')
    .fetchAll({ withRelated: ['user'] })
    .then((dataContributions) => {
      reply.view('admin/data-curation', {
        title: 'Data curation',
        dataContributions: dataContributions.toJSON(),
      });
    });
}

module.exports = {
  handler: dataCuration,
};
