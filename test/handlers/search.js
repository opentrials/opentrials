'use strict';

const should = require('should');

let server;

describe('search handler', () => {
  const apiResponse = JSON.parse(JSON.stringify({
    total_count: 2,
    items: [
      fixtures.getTrial(),
      fixtures.getTrial(),
    ],
  }));

  before(() => getExplorerServer().then((_server) => (server = _server)));

  afterEach(() => {
    cleanAllApiMocks();
  });

  describe('GET /search', () => {
    let response;

    describe('API is OK', () => {
      before(() => {
        mockApiResponses({
          search: {
            response: apiResponse,
          },
        });

        return server.inject('/search')
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200);
      });

      it('uses the "search" template', () => (
        response.request.response.source.template.should.equal('search')
      ));

      it('adds the trials into the context', () => {
        const context = response.request.response.source.context;

        context.trials.should.deepEqual(apiResponse);
      });

      it('adds the page number 1 into the context', () => {
        response.request.response.source.context.currentPage.should.equal(1);
      });

      it('adds advancedSearchIsVisible as false into the context', () => {
        const context = response.request.response.source.context;

        context.advancedSearchIsVisible.should.equal(false);
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        mockApiResponses({
          search: { statusCode: 500 },
          sources: { statusCode: 500 },
        });

        return server.inject('/search')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });

  describe('Validation Errors', () => {
    describe('page', () => {
      it('accepts page 1', () => {
        mockApiResponses({
          search: { query: { page: 1 } },
        });

        return server.inject('/search?page=1')
          .then((_response) => {
            _response.statusCode.should.equal(200);
          });
      });

      it('accepts page 100', () => {
        mockApiResponses({
          search: { query: { page: 100 } },
        });

        return server.inject('/search?page=100')
          .then((_response) => {
            _response.statusCode.should.equal(200);
          });
      });

      it('validates page is greater than zero', () => server.inject('/search?page=0')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));

      it('validates page is less than 100', () => server.inject('/search?page=101')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));

      it('validates page is numeric', () => server.inject('/search?page=ddd')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    describe('registration_date_start', () => {
      it('rejects values not in YYYY-MM-DD format', () => server.inject('/search?registration_date_start=ddd')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    describe('registration_date_end', () => {
      it('rejects values not in YYYY-MM-DD format', () => server.inject('/search?registration_date_end=ddd')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    describe('gender', () => {
      it('rejects values other than "male" and "female"', () => server.inject('/search?gender=some')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    describe('has_published_results', () => {
      it('rejects values other than "true" and "false"', () => server.inject('/search?has_published_results=maybe')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    describe('has_publications', () => {
      it('rejects values other than "true" and "false"', () => server.inject('/search?has_publications=maybe')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    describe('has_discrepancies', () => {
      it('rejects values other than "true" and "false"', () => server.inject('/search?has_discrepancies=maybe')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    describe('sample_size_start', () => {
      it('rejects non-numeric values', () => server.inject('/search?sample_size_start=ddd')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    describe('sample_size_end', () => {
      it('rejects non-numeric values', () => server.inject('/search?sample_size_end=ddd')
          .then((_response) => {
            _response.statusCode.should.equal(400);
          }));
    });

    it('rejects unknown params', () => server.inject('/search?some=param')
        .then((_response) => {
          _response.statusCode.should.equal(400);
        }));
  });

  describe('Query params', () => {
    describe('location', _itHandlesOptionalMultipleStringParams('location'));
    describe('source', _itHandlesOptionalMultipleStringParams('source', 'records.source_id'));

    describe('has_published_results', _itHandlesOptionalBooleanParam('has_published_results'));

    describe('has_publications', _itHandlesOptionalBooleanParamThatChecksExistence('has_publications', 'publications'));
    describe('has_discrepancies', _itHandlesOptionalBooleanParamThatChecksExistence('has_discrepancies', 'discrepancies'));

    describe('condition', _itHandlesOptionalStringParam('condition'));
    describe('intervention', _itHandlesOptionalStringParam('intervention'));
    describe('person', _itHandlesOptionalStringParam('person'));
    describe('organisation', _itHandlesOptionalStringParam('organisation'));

    describe('GET /search?q={queryStr}', () => {
      const queryStr = 'foo bar';
      let response;

      before(() => {
        mockApiResponses({
          search: {
            query: {
              q: queryStr,
            },
          },
        });

        return server.inject(`/search?q=${encodeURIComponent(queryStr)}`)
          .then((_response) => {
            response = _response;
          });
      });

      it('adds the query into the context', () => {
        response.request.response.source.context.query.q.should.equal(queryStr);
      });

      it('adds advancedSearchIsVisible as false into the context', () => {
        const context = response.request.response.source.context;

        context.advancedSearchIsVisible.should.equal(false);
      });
    });

    describe('GET /search?page={page}', () => {
      const page = 51;
      let response;

      before(() => {
        mockApiResponses({
          search: {
            query: {
              page,
            },
            response: apiResponse,
          },
        });

        return server.inject(`/search?page=${page}`)
          .then((_response) => {
            response = _response;
          });
      });

      it('adds the currentPage number into the context', () => {
        response.request.response.source.context.currentPage.should.equal(page);
      });
    });

    describe('GET /search?gender={gender}', () => {
      it('doesnt filter if gender is empty', () => {
        mockApiResponses({
          search: {
            query: {
              q: undefined,
            },
          },
        });

        return server.inject('/search?gender=')
          .then((_response) => {
            _response.statusCode.should.equal(200);
          });
      });

      it('filter by male or both if gender is male', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'gender:(male OR both)',
            },
          },
        });

        return server.inject('/search?gender=male')
          .then((_response) => {
            _response.statusCode.should.equal(200);
          });
      });

      it('filter by female or both if gender is female', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'gender:(female OR both)',
            },
          },
        });

        return server.inject('/search?gender=female')
          .then((_response) => {
            _response.statusCode.should.equal(200);
          });
      });
    });

    describe('GET /search?sample_size_start={start}&sample_size_end={end}', () => {
      it('accepts just sample size start', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'target_sample_size:([100 TO *])',
            },
          },
        });

        return server.inject('/search?sample_size_start=100')
          .then((_response) => {
            _response.statusCode.should.equal(200);
            _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
          });
      });

      it('accepts just sample size end', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'target_sample_size:([* TO 200])',
            },
          },
        });

        return server.inject('/search?sample_size_end=200')
          .then((_response) => {
            _response.statusCode.should.equal(200);
            _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
          });
      });

      it('accepts sample size start and end', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'target_sample_size:([100 TO 200])',
            },
          },
        });

        return server.inject('/search?sample_size_start=100&sample_size_end=200')
          .then((_response) => {
            _response.statusCode.should.equal(200);
            _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
          });
      });
    });

    describe('GET /search?registration_date_start={start}&registration_date_end={end}', () => {
      it('accepts just start date', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'registration_date:([2012-01-01 TO *])',
            },
          },
        });

        return server.inject('/search?registration_date_start=2012-01-01')
          .then((_response) => {
            _response.statusCode.should.equal(200);
            _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
          });
      });

      it('accepts just end date', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'registration_date:([* TO 2016-01-01])',
            },
          },
        });

        return server.inject('/search?registration_date_end=2016-01-01')
          .then((_response) => {
            _response.statusCode.should.equal(200);
            _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
          });
      });

      it('accepts start and end dates', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'registration_date:([2015-01-01 TO 2016-01-01])',
            },
          },
        });

        return server.inject('/search?registration_date_start=2015-01-01&registration_date_end=2016-01-01')
          .then((_response) => {
            _response.statusCode.should.equal(200);
            _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
          });
      });

      it('accepts start and end dates in format MM/DD/YYYY', () => {
        // FIXME: This shouldn't be needed after
        // https://github.com/brianblakely/nodep-date-input-polyfill/issues/31 is
        // fixed
        mockApiResponses({
          search: {
            query: {
              q: 'registration_date:([2015-01-20 TO 2016-01-20])',
            },
          },
        });

        return server.inject('/search?registration_date_start=01/20/2015&registration_date_end=01/20/2016')
          .then((_response) => {
            _response.statusCode.should.equal(200);
            _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
          });
      });
    });

    describe('GET /search?advanced_search{advancedSearch}', () => {
      it('sets advancedSearchIsVisible to true when advanced_search is true', () => {
        mockApiResponses();

        return server.inject('/search?advanced_search=true')
          .then((response) => {
            const context = response.request.response.source.context;
            should(context.advancedSearchIsVisible).be.true();
          });
      });

      it('ignores advanced_search when there are filters', () => {
        mockApiResponses();

        return server.inject('/search?advanced_search=false&location=UK')
          .then((response) => {
            const context = response.request.response.source.context;
            should(context.advancedSearchIsVisible).be.true();
          });
      });
    });
  });
});


function _itHandlesOptionalMultipleStringParams(paramName, _apiParamName) {
  const apiParamName = (_apiParamName === undefined) ? paramName : _apiParamName;

  return () => describe(`GET /search?${paramName}={${paramName}ID}&${paramName}={${paramName}ID}`, () => {
    const searchResponse = { total_count: 0, items: [] };

    describe(`single ${paramName}`, () => {
      it('converts the query to an array', () => {
        mockApiResponses({
          search: {
            query: {
              q: `${apiParamName}:("Foo Bar")`,
            },
            response: searchResponse,
          },
        });

        return server.inject(`/search?${paramName}=Foo+Bar`)
          .then((response) => {
            const context = response.request.response.source.context;
            context.query[paramName].should.deepEqual(['Foo Bar']);
          });
      });
    });

    describe(`multiple ${paramName}`, () => {
      let response;
      before(() => {
        mockApiResponses({
          search: {
            query: {
              q: `${apiParamName}:("Foo Bar" OR "Baz")`,
            },
            response: searchResponse,
          },
        });

        return server.inject(`/search?${paramName}=Foo+Bar&${paramName}=Baz`)
          .then((_response) => {
            response = _response;
          });
      });

      it('calls the API correctly', () => {
        const context = response.request.response.source.context;

        context.trials.should.deepEqual(searchResponse);
      });

      it(`adds the ${paramName} to context.query`, () => {
        const context = response.request.response.source.context;

        context.query[paramName].should.deepEqual(['Foo Bar', 'Baz']);
      });

      it('adds advancedSearchIsVisible as true into the context', () => {
        const context = response.request.response.source.context;

        context.advancedSearchIsVisible.should.equal(true);
      });
    });

    it('escapes special elasticsearch values', () => {
      mockApiResponses({
        search: {
          query: {
            q: `${apiParamName}:("foo\\(bar\\)")`,
          },
        },
      });

      return server.inject(`/search?${paramName}=foo(bar)`)
        .then((response) => {
          response.statusCode.should.equal(200);
        });
    });
  });
}

function _itHandlesOptionalBooleanParam(paramName, _apiParamName) {
  const apiParamName = (_apiParamName === undefined) ? paramName : _apiParamName;

  return () => describe(`GET /search?${paramName}={${paramName}}`, () => {
    it(`doesnt filter if ${paramName} is empty`, () => {
      mockApiResponses({
        search: {
          query: {
            q: undefined,
          },
        },
      });

      return server.inject(`/search?${paramName}=`)
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it(`filter by trials with published results if ${paramName} is true`, () => {
      mockApiResponses({
        search: {
          query: {
            q: `${apiParamName}:(true)`,
          },
        },
      });

      return server.inject(`/search?${paramName}=true`)
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it(`filter by trials without published results if ${paramName} is false`, () => {
      mockApiResponses({
        search: {
          query: {
            q: `${apiParamName}:(false)`,
          },
        },
      });

      return server.inject(`/search?${paramName}=false`)
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });
  });
}

function _itHandlesOptionalStringParam(paramName) {
  return () => describe(`GET /search?${paramName}={${paramName}}`, () => {
    const searchResponse = { total_count: 0, items: [] };

    it('does the correct query', () => {
      mockApiResponses({
        search: {
          query: {
            q: `${paramName}:(Foo Bar)`,
          },
          response: searchResponse,
        },
      });

      return server.inject(`/search?${paramName}=Foo+Bar`)
        .then((response) => {
          const context = response.request.response.source.context;
          context.query[paramName].should.equal('Foo Bar');
        });
    });

    it('escapes special elasticsearch values', () => {
      mockApiResponses({
        search: {
          query: {
            q: `${paramName}:(foo\\(bar\\))`,
          },
        },
        response: searchResponse,
      });

      return server.inject(`/search?${paramName}=foo(bar)`)
        .then((response) => {
          response.statusCode.should.equal(200);
        });
    });
  });
}

function _itHandlesOptionalBooleanParamThatChecksExistence(paramName, _apiParamName) {
  const apiParamName = (_apiParamName === undefined) ? paramName : _apiParamName;

  return () => describe(`GET /search?${paramName}={${paramName}}`, () => {
    it(`doesnt filter if ${paramName} is empty`, () => {
      mockApiResponses({
        search: {
          query: {
            q: undefined,
          },
        },
      });

      return server.inject(`/search?${paramName}=`)
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it(`filter by trials with published results if ${paramName} is true`, () => {
      mockApiResponses({
        search: {
          query: {
            q: `_exists_:(${apiParamName})`,
          },
        },
      });

      return server.inject(`/search?${paramName}=true`)
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it(`filter by trials without published results if ${paramName} is false`, () => {
      mockApiResponses({
        search: {
          query: {
            q: `_missing_:(${apiParamName})`,
          },
        },
      });

      return server.inject(`/search?${paramName}=false`)
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });
  });
}
