'use strict';

const should = require('should');
const decorateFDADocument = require('../../../../presenters/fda_document');

describe('FDA Search Handler', () => {
  const apiResponse = {
    total_count: 2,
    items: [
      fixtures.getFDADocument(),
      fixtures.getFDADocument(),
    ],
  };
  let server;

  before(() => getFDAServer().then((_server) => (server = _server)));

  afterEach(() => {
    cleanAllApiMocks();
  });

  describe('GET /search', () => {
    describe('API is OK', () => {
      beforeEach(() => {
        mockApiResponses({
          'search/fda_documents': {
            response: apiResponse,
          },
        });
      });

      it('is successful', () => (
        server.inject('/search')
          .then((response) => should(response.statusCode).eql(200))
      ));

      it('uses the "fda/index" template', () => (
        server.inject('/search')
          .then((response) => {
            should(response.request.response.source.template).eql('fda/index');
          })
      ));

      it('adds the decorated FDA documents into the context', () => (
        server.inject('/search')
          .then((response) => {
            const context = response.request.response.source.context;
            const expectedApiResponse = Object.assign(
              {},
              apiResponse,
              {
                items: apiResponse.items.map((doc) => decorateFDADocument(doc)),
              }
            );
            should(context.fdaDocuments).deepEqual(expectedApiResponse);
          })
      ));

      it('adds the page number 1 into the context', () => (
        server.inject('/search')
          .then((response) => {
            const context = response.request.response.source.context;
            should(context.currentPage).eql(1);
          })
      ));

      it('adds advancedSearchIsVisible as false into the context', () => (
        server.inject('/search')
          .then((response) => {
            const context = response.request.response.source.context;
            should(context.advancedSearchIsVisible).eql(false);
          })
      ));
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        mockApiResponses({
          'search/fda_documents': {
            statusCode: 500,
          },
        });

        return server.inject('/search')
          .then((response) => {
            should(response.statusCode).eql(502);
          });
      });
    });
  });

  describe('GET /search?q={queryStr}', () => {
    const queryStr = 'foo bar';

    beforeEach(() => {
      mockApiResponses({
        'search/fda_documents': {
          query: {
            q: queryStr,
          },
        },
      });
    });

    it('adds the query into the context', () => (
      server.inject(`/search?q=${encodeURIComponent(queryStr)}`)
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.query.q).eql(queryStr);
        })
    ));

    it('adds advancedSearchIsVisible as false into the context', () => (
      server.inject(`/search?q=${encodeURIComponent(queryStr)}`)
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.advancedSearchIsVisible).eql(false);
        })
    ));
  });

  describe('GET /search?text={textQuery}', () => {
    const textQuery = 'foo bar';

    beforeEach(() => {
      mockApiResponses({
        'search/fda_documents': {
          query: {
            text: textQuery,
          },
        },
      });
    });

    it('adds the text query into the context', () => (
      server.inject(`/search?text=${encodeURIComponent(textQuery)}`)
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.query.text).eql(textQuery);
        })
    ));

    it('adds advancedSearchIsVisible as true into the context', () => (
      server.inject(`/search?text=${encodeURIComponent(textQuery)}`)
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.advancedSearchIsVisible).eql(true);
        })
    ));
  });

  describe('GET /search?page={page}', () => {
    it('adds the currentPage number into the context', () => {
      const page = 51;
      mockApiResponses({
        'search/fda_documents': {
          query: {
            page,
          },
        },
      });

      return server.inject(`/search?page=${page}`)
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.currentPage).eql(page);
        });
    });
  });

  describe('GET /search?drug={name}', () => {
    it('filters by drug name', () => {
      mockApiResponses({
        'search/fda_documents': {
          query: {
            q: 'drug:(Health potion)',
          },
        },
      });

      return server.inject('/search?drug=Health potion')
        .then((response) => {
          should(response.statusCode).equal(200);
        });
    });
  });

  describe('GET /search?active_ingredients={name}', () => {
    it('filters by active ingredients', () => {
      mockApiResponses({
        'search/fda_documents': {
          query: {
            q: 'active_ingredients:(Ginseng)',
          },
        },
      });

      return server.inject('/search?active_ingredients=Ginseng')
        .then((response) => {
          should(response.statusCode).equal(200);
        });
    });
  });

  describe('GET /search?name={name}', () => {
    describe('single document type', () => {
      it('filters by document type and converts it to array', () => {
        mockApiResponses({
          'search/fda_documents': {
            query: {
              q: 'name:("Letter")',
            },
          },
        });

        return server.inject('/search?name=Letter')
          .then((response) => {
            const context = response.request.response.source.context;
            should(response.statusCode).equal(200);
            should(context.query.name).deepEqual(['Letter']);
          });
      });
    });

    describe('multiple document types', () => {
      it('filters by document type', () => {
        mockApiResponses({
          'search/fda_documents': {
            query: {
              q: 'name:("Medical review" OR "Letter")',
            },
          },
        });

        return server.inject('/search?name=Medical review&name=Letter')
          .then((response) => {
            const context = response.request.response.source.context;
            should(response.statusCode).equal(200);
            should(context.query.name).deepEqual(['Medical review', 'Letter']);
          });
      });
    });
  });

  describe('GET /search?application_id={id}', () => {
    it('filters by FDA application ID', () => {
      mockApiResponses({
        'search/fda_documents': {
          query: {
            q: 'application_id:(NDA000000)',
          },
        },
      });

      return server.inject('/search?application_id=NDA000000')
        .then((response) => {
          should(response.statusCode).equal(200);
        });
    });
  });

  describe('GET /search?application_type={id}', () => {
    describe('single application type', () => {
      it('filters by FDA application type and converts it to array', () => {
        mockApiResponses({
          'search/fda_documents': {
            query: {
              q: 'application_type:("NDA")',
            },
          },
        });

        return server.inject('/search?application_type=NDA')
          .then((response) => {
            const context = response.request.response.source.context;
            should(response.statusCode).equal(200);
            should(context.query.application_type).deepEqual(['NDA']);
          });
      });
    });

    describe('multiple application types', () => {
      it('filters by FDA application type', () => {
        mockApiResponses({
          'search/fda_documents': {
            query: {
              q: 'application_type:("NDA" OR "ANDA")',
            },
          },
        });

        return server.inject('/search?application_type=NDA&application_type=ANDA')
          .then((response) => {
            const context = response.request.response.source.context;
            should(response.statusCode).equal(200);
            should(context.query.application_type).deepEqual(['NDA', 'ANDA']);
          });
      });
    });
  });

  describe('GET /search?action_date_start={start}&action_date_end={end}', () => {
    it('accepts just start date', () => {
      mockApiResponses({
        'search/fda_documents': {
          query: {
            q: 'action_date:([2012-01-01 TO *])',
          },
        },
      });

      return server.inject('/search?action_date_start=2012-01-01')
        .then((response) => {
          should(response.statusCode).eql(200);
          should(response.request.response.source.context.advancedSearchIsVisible).eql(true);
        });
    });

    it('accepts just end date', () => {
      mockApiResponses({
        'search/fda_documents': {
          query: {
            q: 'action_date:([* TO 2016-01-01])',
          },
        },
      });

      return server.inject('/search?action_date_end=2016-01-01')
        .then((response) => {
          should(response.statusCode).eql(200);
          should(response.request.response.source.context.advancedSearchIsVisible).eql(true);
        });
    });

    it('accepts start and end dates', () => {
      mockApiResponses({
        'search/fda_documents': {
          query: {
            q: 'action_date:([2015-01-01 TO 2016-01-01])',
          },
        },
      });

      return server.inject('/search?action_date_start=2015-01-01&action_date_end=2016-01-01')
        .then((response) => {
          should(response.statusCode).equal(200);
          should(response.request.response.source.context.advancedSearchIsVisible).eql(true);
        });
    });

    it('accepts start and end dates in format MM/DD/YYYY', () => {
      // FIXME: This shouldn't be needed after
      // https://github.com/brianblakely/nodep-date-input-polyfill/issues/31 is
      // fixed
      mockApiResponses({
        'search/fda_documents': {
          query: {
            q: 'action_date:([2015-01-20 TO 2016-01-20])',
          },
        },
      });

      return server.inject('/search?action_date_start=01/20/2015&action_date_end=01/20/2016')
        .then((response) => {
          should(response.statusCode).equal(200);
          should(response.request.response.source.context.advancedSearchIsVisible).eql(true);
        });
    });
  });

  describe('Validation Errors', () => {
    describe('page', () => {
      it('accepts page 1', () => {
        mockApiResponses({ 'search/fda_documents': { query: { page: 1 } } });

        return server.inject('/search?page=1')
          .then((response) => {
            should(response.statusCode).equal(200);
          });
      });

      it('accepts page 100', () => {
        mockApiResponses({ 'search/fda_documents': { query: { page: 100 } } });

        return server.inject('/search?page=100')
          .then((response) => {
            should(response.statusCode).equal(200);
          });
      });

      it('validates page is greater than zero', () => server.inject('/search?page=0')
          .then((response) => {
            should(response.statusCode).equal(400);
          }));

      it('validates page is less than 100', () => server.inject('/search?page=101')
          .then((response) => {
            should(response.statusCode).equal(400);
          }));

      it('validates page is numeric', () => server.inject('/search?page=ddd')
          .then((response) => {
            should(response.statusCode).equal(400);
          }));
    });

    describe('action_date_start', () => {
      it('rejects values not in YYYY-MM-DD format', () => server.inject('/search?action_date_start=ddd')
          .then((response) => {
            should(response.statusCode).equal(400);
          }));
    });

    describe('action_date_end', () => {
      it('rejects values not in YYYY-MM-DD format', () => server.inject('/search?action_date_end=ddd')
          .then((response) => {
            should(response.statusCode).equal(400);
          }));
    });

    it('rejects unknown params', () => (
      server.inject('/search?some=param')
        .then((response) => {
          should(response.statusCode).equal(400);
        })
    ));
  });
});
