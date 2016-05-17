'use strict';

const uuid = require('node-uuid');
const bookshelf = require('../config').bookshelf;


const BaseModel = bookshelf.Model.extend({
  initialize: function initialize() {
    this.on('saving', this.addIdIfNeeded);
  },
  addIdIfNeeded: (model) => {
    if (!model.attributes.id) {
      model.attributes.id = uuid.v1(); // eslint-disable-line no-param-reassign
    }
  },
});

module.exports = BaseModel;
