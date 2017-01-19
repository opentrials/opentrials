'use strict';

const should = require('should');

describe('search handler', () => {
  const apiResponse = JSON.parse(JSON.stringify({
    total_count: 2,
    items: [
      fixtures.getTrial(),
      fixtures.getTrial(),
    ],
  }));
  let server;

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
        mockApiResponses({ search: { query: { page: 1 } } });

        return server.inject('/search?page=1')
          .then((_response) => {
            _response.statusCode.should.equal(200);
          });
      });

      it('accepts page 100', () => {
        mockApiResponses({ search: { query: { page: 100 } } });

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

  describe('GET /search?has_published_results={has_published_results}', () => {
    it('doesnt filter if has_published_results is empty', () => {
      mockApiResponses({
        search: {
          query: {
            q: undefined,
          },
        },
      });

      return server.inject('/search?has_published_results=')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it('filter by trials with published results if has_published_results is true', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'has_published_results:(true)',
          },
        },
      });

      return server.inject('/search?has_published_results=true')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it('filter by trials without published results if has_published_results is false', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'has_published_results:(false)',
          },
        },
      });

      return server.inject('/search?has_published_results=false')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });
  });

  describe('GET /search?has_publications={has_publications}', () => {
    it('doesnt filter if has_publications is empty', () => {
      mockApiResponses({
        search: {
          query: {
            q: undefined,
          },
        },
      });

      return server.inject('/search?has_publications=')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it('filter by trials with published results if has_publications is true', () => {
      mockApiResponses({
        search: {
          query: {
            q: '_exists_:(publications)',
          },
        },
      });

      return server.inject('/search?has_publications=true')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it('filter by trials without published results if has_publications is false', () => {
      mockApiResponses({
        search: {
          query: {
            q: '_missing_:(publications)',
          },
        },
      });

      return server.inject('/search?has_publications=false')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });
  });

  describe('GET /search?has_discrepancies={has_discrepancies}', () => {
    it('doesnt filter if has_discrepancies is empty', () => {
      mockApiResponses({
        search: {
          query: {
            q: undefined,
          },
        },
      });

      return server.inject('/search?has_discrepancies=')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it('filter by trials with published results if has_discrepancies is true', () => {
      mockApiResponses({
        search: {
          query: {
            q: '_exists_:(discrepancies)',
          },
        },
      });

      return server.inject('/search?has_discrepancies=true')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });

    it('filter by trials without published results if has_discrepancies is false', () => {
      mockApiResponses({
        search: {
          query: {
            q: '_missing_:(discrepancies)',
          },
        },
      });

      return server.inject('/search?has_discrepancies=false')
        .then((_response) => {
          _response.statusCode.should.equal(200);
        });
    });
  });

  describe('GET /search?condition={condition}&condition={condition}', () => {
    const searchResponse = { total_count: 0, items: [] };

    describe('single condition', () => {
      it('converts the query condition to an array', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'condition:("HIV")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?condition=HIV')
          .then((response) => {
            const context = response.request.response.source.context;
            context.query.condition.should.deepEqual(['HIV']);
          });
      });
    });

    describe('multiple conditions', () => {
      let response;

      before(() => {
        mockApiResponses({
          search: {
            query: {
              q: 'condition:("HIV" OR "Breast Cancer")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?condition=HIV&condition=Breast+Cancer')
          .then((_response) => {
            response = _response;
          });
      });

      it('calls the API correctly', () => {
        const context = response.request.response.source.context;

        context.trials.should.deepEqual(searchResponse);
      });

      it('adds the conditions to context.query', () => {
        const context = response.request.response.source.context;

        context.query.condition.should.deepEqual(['HIV', 'Breast Cancer']);
      });
    });

    it('escapes special elasticsearch values', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'condition:("foo\\(bar\\)")',
          },
        },
        response: searchResponse,
      });

      return server.inject('/search?condition=foo(bar)')
        .then((response) => {
          response.statusCode.should.equal(200);
        });
    });
  });

  describe('GET /search?intervention={intervention}&intervention={intervention}', () => {
    const searchResponse = { total_count: 0, items: [] };

    describe('single intervention', () => {
      it('converts the query intervention to an array', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'intervention:("Hippocrates")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?intervention=Hippocrates')
          .then((response) => {
            const context = response.request.response.source.context;
            context.query.intervention.should.deepEqual(['Hippocrates']);
          });
      });
    });

    describe('multiple interventions', () => {
      let response;

      before(() => {
        mockApiResponses({
          search: {
            query: {
              q: 'intervention:("Placebo" OR "Aspirin")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?intervention=Placebo&intervention=Aspirin')
          .then((_response) => {
            response = _response;
          });
      });

      it('calls the API correctly', () => {
        const context = response.request.response.source.context;

        context.trials.should.deepEqual(searchResponse);
      });

      it('adds the interventions to context.query', () => {
        const context = response.request.response.source.context;

        context.query.intervention.should.deepEqual(['Placebo', 'Aspirin']);
      });
    });

    it('escapes special elasticsearch values', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'intervention:("foo\\(bar\\)")',
          },
        },
      });

      return server.inject('/search?intervention=foo(bar)')
        .then((response) => {
          response.statusCode.should.equal(200);
        });
    });
  });

  describe('GET /search?person={person}&person={person}', () => {
    const searchResponse = { total_count: 0, items: [] };

    describe('single person', () => {
      it('converts the query person to an array', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'person:("Hippocrates")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?person=Hippocrates')
          .then((response) => {
            const context = response.request.response.source.context;
            context.query.person.should.deepEqual(['Hippocrates']);
          });
      });
    });

    describe('multiple persons', () => {
      let response;

      before(() => {
        mockApiResponses({
          search: {
            query: {
              q: 'person:("Hippocrates" OR "Florence Nightingale")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?person=Hippocrates&person=Florence+Nightingale')
          .then((_response) => {
            response = _response;
          });
      });

      it('calls the API correctly', () => {
        const context = response.request.response.source.context;

        context.trials.should.deepEqual(searchResponse);
      });

      it('adds the persons to context.query', () => {
        const context = response.request.response.source.context;

        context.query.person.should.deepEqual(['Hippocrates', 'Florence Nightingale']);
      });
    });

    it('escapes special elasticsearch values', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'person:("foo\\(bar\\)")',
          },
        },
      });

      return server.inject('/search?person=foo(bar)')
        .then((response) => {
          response.statusCode.should.equal(200);
        });
    });
  });

  describe('GET /search?organisation={organisation}&organisation={organisation}', () => {
    const searchResponse = { total_count: 0, items: [] };

    describe('single organisation', () => {
      it('converts the query organisation to an array', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'organisation:("ACME")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?organisation=ACME')
          .then((response) => {
            const context = response.request.response.source.context;
            context.query.organisation.should.deepEqual(['ACME']);
          });
      });
    });

    describe('multiple organisations', () => {
      let response;

      before(() => {
        mockApiResponses({
          search: {
            query: {
              q: 'organisation:("ACME" OR "NSA")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?organisation=ACME&organisation=NSA')
          .then((_response) => {
            response = _response;
          });
      });

      it('calls the API correctly', () => {
        const context = response.request.response.source.context;

        context.trials.should.deepEqual(searchResponse);
      });

      it('adds the organisations to context.query', () => {
        const context = response.request.response.source.context;

        context.query.organisation.should.deepEqual(['ACME', 'NSA']);
      });
    });

    it('escapes special elasticsearch values', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'organisation:("foo\\(bar\\)")',
          },
        },
      });

      return server.inject('/search?organisation=foo(bar)')
        .then((response) => {
          response.statusCode.should.equal(200);
        });
    });
  });

  describe('GET /search?location={locationID}&location={locationID}', () => {
    const searchResponse = { total_count: 0, items: [] };

    describe('single location', () => {
      it('converts the query to an array', () => {
        mockApiResponses({
          search: {
            query: {
              q: 'location:("Czech Republic")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?location=Czech+Republic')
          .then((response) => {
            const context = response.request.response.source.context;
            context.query.location.should.deepEqual(['Czech Republic']);
          });
      });
    });

    describe('multiple locations', () => {
      let response;
      before(() => {
        mockApiResponses({
          search: {
            query: {
              q: 'location:("Czech Republic" OR "Brazil")',
            },
            response: searchResponse,
          },
        });

        return server.inject('/search?location=Czech+Republic&location=Brazil')
          .then((_response) => {
            response = _response;
          });
      });

      it('calls the API correctly', () => {
        const context = response.request.response.source.context;

        context.trials.should.deepEqual(searchResponse);
      });

      it('adds the locations to context.query', () => {
        const context = response.request.response.source.context;

        context.query.location.should.deepEqual(['Czech Republic', 'Brazil']);
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
            q: 'location:("foo\\(bar\\)")',
          },
        },
      });

      return server.inject('/search?location=foo(bar)')
        .then((response) => {
          response.statusCode.should.equal(200);
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
