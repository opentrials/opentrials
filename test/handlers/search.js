const server = require('../../server');

describe('search handler', () => {
  const apiResponse = JSON.parse(JSON.stringify({
    total_count: 2,
    items: [
      fixtures.getTrial(),
      fixtures.getTrial(),
    ],
  }));
  const locationsResponse = [
    fixtures.getLocation(),
    fixtures.getLocation(),
  ];

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
          locations: {
            response: locationsResponse,
          },
        });

        return server.inject('/search')
          .then((_response) => {
            response = _response;
          });
      });

      it('is successful', () => {
        response.statusCode.should.equal(200)
      });

      it('uses the "search" template', () => (
        response.request.response.source.template.should.equal('search')
      ));

      it('adds the trials into the context', () => {
        const context = response.request.response.source.context;

        context.trials.should.deepEqual(apiResponse);
      });

      it('adds the locations into the context', () => {
        const context = response.request.response.source.context;

        context.locations.should.deepEqual(locationsResponse);
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
          locations: { statusCode: 500 },
        });

        return server.inject('/search')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });

  describe('GET /search?{query}', () => {
    it('adds the query into the context', () => {
      mockApiResponses();
      return server.inject('/search?foo=bar&baz=51')
        .then((_response) => {
          _response.request.response.source.context.query.should.deepEqual({
            foo: 'bar',
            baz: '51',
          });
        });
    });
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

      return server.inject('/search?q='+encodeURIComponent(queryStr))
        .then((_response) => {
          response = _response;
        });
    });

    it('adds the query into the context', () => {
      response.request.response.source.context.query.q.should.equal(queryStr)
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
            page: page,
          },
          response: apiResponse,
        },
      });

      return server.inject('/search?page='+page)
        .then((_response) => {
          response = _response;
        });
    });

    it('adds the currentPage number into the context', () => {
      response.request.response.source.context.currentPage.should.equal(page)
    });
  });

  describe('GET /search?location={locationID}', () => {
    let response;
    const searchResponse = { total_count: 0, items: [] };

    before(() => {
      mockApiResponses({
        search: {
          query: {
            q: '(foo bar) AND location:"Czech Republic"',
          },
          response: searchResponse,
        },
      });

      return server.inject('/search?q=foo+bar&location=Czech+Republic')
        .then((_response) => {
          response = _response;
        });
    });

    it('calls the API correctly', () => {
      const context = response.request.response.source.context;

      context.trials.should.deepEqual(searchResponse);
    });

    it('adds advancedSearchIsVisible as true into the context', () => {
      const context = response.request.response.source.context;

      context.advancedSearchIsVisible.should.equal(true);
    });
  });

  describe('GET /search?registration_date_start={start}&registration_date_end={end}', () => {
    it('accepts just start date', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'registration_date:[2012-01-01 TO *]',
          },
        },
      });

      return server.inject('/search?registration_date_start=2012-01-01')
        .then((_response) => {
          _response.statusCode.should.equal(200)
          _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
        });
    });

    it('accepts just end date', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'registration_date:[* TO 2016-01-01]'
          },
        },
      });

      return server.inject('/search?registration_date_end=2016-01-01')
        .then((_response) => {
          _response.statusCode.should.equal(200)
          _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
        });
    });

    it('accepts start and end dates', () => {
      mockApiResponses({
        search: {
          query: {
            q: 'registration_date:[2015-01-01 TO 2016-01-01]',
          },
        },
      });

      return server.inject('/search?registration_date_start=2015-01-01&registration_date_end=2016-01-01')
        .then((_response) => {
          _response.statusCode.should.equal(200)
          _response.request.response.source.context.advancedSearchIsVisible.should.equal(true);
        });
    });
  });

  describe('pagination', () => {
    describe('no results', () => {
      it('returns empty pagination', () => {
        const apiResponseNoResults = { total_count: 0, items: [] };
        mockApiResponses({
          search: {
            response: apiResponseNoResults,
          }
        })

        return server.inject('/search')
          .then((_response) => {
            const pagination = _response.request.response.source.context.pagination;
            pagination.should.deepEqual([]);
          });
      });
    });

    describe('single page', () => {
      it('returns empty pagination', () => {
        const apiResponseSinglePage = Object.assign(apiResponse, { total_count: 5 });
        mockApiResponses({
          search: {
            response: apiResponseSinglePage,
          }
        })

        return server.inject('/search')
          .then((_response) => {
            const pagination = _response.request.response.source.context.pagination;
            pagination.should.deepEqual([]);
          });
      });
    });

    describe('more than 1 and less than 10 pages', () => {
      it('works as expected', () => {
        const apiResponseLessThan10Pages = Object.assign(apiResponse, { total_count: 20 });
        mockApiResponses({
          search: {
            response: apiResponseLessThan10Pages,
          }
        })

        return server.inject('/search')
          .then((_response) => {
            const pagination = _response.request.response.source.context.pagination;
            pagination.should.deepEqual([
              { page: 1, label: '«', url: '/search?page=1' },
              { page: 1, label: '‹', url: '/search?page=1' },
              { page: 1, label: 1, url: '/search?page=1' },
              { page: 2, label: 2, url: '/search?page=2' },
              { page: 2, label: '›', url: '/search?page=2' },
              { page: 2, label: '»', url: '/search?page=2' },
            ]);
          });
      });
    });

    describe('more than 10 pages', () => {
      const apiResponseMoreThan10Pages = Object.assign({}, { total_count: 500 });

      it('works on the beginning of the page list', () => {
        const page = 3;
        mockApiResponses({
          search: {
            response: apiResponseMoreThan10Pages,
            query: {
              page,
            },
          }
        })

        return server.inject('/search?page='+page)
          .then((_response) => {
            const pagination = _response.request.response.source.context.pagination;
            pagination.should.deepEqual([
              { page: 1, label: '«', url: '/search?page=1' },
              { page: 2, label: '‹', url: '/search?page=2' },
              { page: 1, label: 1, url: '/search?page=1' },
              { page: 2, label: 2, url: '/search?page=2' },
              { page: 3, label: 3, url: '/search?page=3' },
              { page: 4, label: 4, url: '/search?page=4' },
              { page: 5, label: 5, url: '/search?page=5' },
              { page: 6, label: 6, url: '/search?page=6' },
              { page: 7, label: 7, url: '/search?page=7' },
              { page: 8, label: 8, url: '/search?page=8' },
              { page: 9, label: 9, url: '/search?page=9' },
              { page: 10, label: 10, url: '/search?page=10' },
              { page: 4, label: '›', url: '/search?page=4' },
              { page: 50, label: '»', url: '/search?page=50' },
            ])
          });
      });

      it('works on the middle of the page list', () => {
        const page = 25;
        mockApiResponses({
          search: {
            response: apiResponseMoreThan10Pages,
            query: {
              page,
            },
          }
        })

        return server.inject('/search?page='+page)
          .then((_response) => {
            const pagination = _response.request.response.source.context.pagination;
            pagination.should.deepEqual([
              { page: 1, label: '«', url: '/search?page=1' },
              { page: 24, label: '‹', url: '/search?page=24' },
              { page: 21, label: 21, url: '/search?page=21' },
              { page: 22, label: 22, url: '/search?page=22' },
              { page: 23, label: 23, url: '/search?page=23' },
              { page: 24, label: 24, url: '/search?page=24' },
              { page: 25, label: 25, url: '/search?page=25' },
              { page: 26, label: 26, url: '/search?page=26' },
              { page: 27, label: 27, url: '/search?page=27' },
              { page: 28, label: 28, url: '/search?page=28' },
              { page: 29, label: 29, url: '/search?page=29' },
              { page: 30, label: 30, url: '/search?page=30' },
              { page: 26, label: '›', url: '/search?page=26' },
              { page: 50, label: '»', url: '/search?page=50' },
            ])
          });
      });

      it('works on the end of the page list', () => {
        const page = 50;
        mockApiResponses({
          search: {
            response: apiResponseMoreThan10Pages,
            query: {
              page,
            },
          }
        })

        return server.inject('/search?page='+page)
          .then((_response) => {
            const pagination = _response.request.response.source.context.pagination;
            pagination.should.deepEqual([
              { page: 1, label: '«', url: '/search?page=1' },
              { page: 49, label: '‹', url: '/search?page=49' },
              { page: 41, label: 41, url: '/search?page=41' },
              { page: 42, label: 42, url: '/search?page=42' },
              { page: 43, label: 43, url: '/search?page=43' },
              { page: 44, label: 44, url: '/search?page=44' },
              { page: 45, label: 45, url: '/search?page=45' },
              { page: 46, label: 46, url: '/search?page=46' },
              { page: 47, label: 47, url: '/search?page=47' },
              { page: 48, label: 48, url: '/search?page=48' },
              { page: 49, label: 49, url: '/search?page=49' },
              { page: 50, label: 50, url: '/search?page=50' },
              { page: 50, label: '›', url: '/search?page=50' },
              { page: 50, label: '»', url: '/search?page=50' },
            ])
          });
      });
    });

    describe('more than 100 pages', () => {
      it('should limit to 100 pages', () => {
        const apiResponseInfinitePages = Object.assign(apiResponse, { total_count: 99999999 });
        mockApiResponses({
          search: {
            response: apiResponseInfinitePages,
          }
        })

        return server.inject('/search')
          .then((_response) => {
            const pagination = _response.request.response.source.context.pagination;
            pagination[pagination.length - 1].page.should.eql(100);
          });
      });
    });
  });
});
