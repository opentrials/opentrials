const server = require('../../server');

describe('search handler', () => {
  const apiResponse = JSON.parse(JSON.stringify({
    total_count: 2,
    items: [
      fixtures.getTrial(),
      fixtures.getTrial(),
    ],
  }));
  let response;

  describe('GET /search', () => {
    describe('API is OK', () => {
      before(() => {
        apiServer.get('/search?per_page=10').reply(200, apiResponse);

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

        context.results.should.deepEqual(apiResponse);
      });

      it('adds the page number 1 into the context', () => {
        response.request.response.source.context.currentPage.should.equal(1);
      });
    });

    describe('API is not OK', () => {
      it('returns error 502', () => {
        apiServer.get('/search?per_page=10').reply(500);

        return server.inject('/search')
          .then((_response) => {
            _response.statusCode.should.equal(502);
          });
      });
    });
  });

  describe('GET /search?q={query}', () => {
    const query = 'foo bar';

    before(() => {
      apiServer.get('/search?q='+encodeURI(query)+'&per_page=10').reply(200, apiResponse);

      return server.inject('/search?q='+encodeURI(query))
        .then((_response) => {
          response = _response;
        });
    });

    it('adds the query into the context', () => {
      response.request.response.source.context.query.should.equal(query)
    });
  });

  describe('GET /search?page={page}', () => {
    const page = 51;

    before(() => {
      apiServer.get('/search?page='+page+'&per_page=10').reply(200, apiResponse);

      return server.inject('/search?page='+page)
        .then((_response) => {
          response = _response;
        });
    });

    it('adds the currentPage number into the context', () => {
      response.request.response.source.context.currentPage.should.equal(page)
    });
  });

  describe('pagination', () => {
    describe('no results', () => {
      it('returns empty pagination', () => {
        const apiResponseNoResults = { total_count: 0, items: [] };
        apiServer.get('/search?per_page=10').reply(200, apiResponseNoResults);
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
        apiServer.get('/search?per_page=10').reply(200, apiResponseSinglePage);
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
        apiServer.get('/search?per_page=10').reply(200, apiResponseLessThan10Pages);
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
        apiServer.get('/search?page='+page+'&per_page=10').reply(200, apiResponseMoreThan10Pages);

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
        apiServer.get('/search?page='+page+'&per_page=10').reply(200, apiResponseMoreThan10Pages);

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
        apiServer.get('/search?page='+page+'&per_page=10').reply(200, apiResponseMoreThan10Pages);

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
  });
});
