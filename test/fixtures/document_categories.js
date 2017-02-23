'use strict';

function listDocumentCategories() {
  return {
    total_count: 1,
    items: [
      {
        id: 20,
        name: 'Other',
        group: null,
      },
      {
        id: 21,
        name: 'Journal article',
        group: 'Results',
      },
    ],
  };
}

module.exports = listDocumentCategories;
