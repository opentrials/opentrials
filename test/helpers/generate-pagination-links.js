'use strict';

const should = require('should');
const url = require('url');
const generatePaginationLinks = require('../../helpers/generate-pagination-links');

describe('generatePaginationLinks', () => {
  describe('no results', () => {
    it('returns empty pagination', () => {
      const requestUrl = url.parse('/search');
      const currentPage = 1;
      const perPage = 10;
      const maxPages = 100;
      const totalCount = 0;
      const pagination = generatePaginationLinks(
        requestUrl, currentPage,
        perPage, maxPages,
        totalCount
      );

      should(pagination).deepEqual([]);
    });
  });

  describe('single page', () => {
    it('returns empty pagination', () => {
      const requestUrl = url.parse('/search');
      const currentPage = 1;
      const perPage = 10;
      const maxPages = 100;
      const totalCount = perPage;
      const pagination = generatePaginationLinks(
        requestUrl, currentPage,
        perPage, maxPages,
        totalCount
      );

      should(pagination).deepEqual([]);
    });
  });

  describe('more than 1 and less than 10 pages', () => {
    it('works as expected', () => {
      const requestUrl = url.parse('/search');
      const currentPage = 1;
      const perPage = 10;
      const maxPages = 100;
      const totalCount = perPage * 2;
      const pagination = generatePaginationLinks(
        requestUrl, currentPage,
        perPage, maxPages,
        totalCount
      );

      should(pagination).deepEqual([
        { page: 1, label: '«', url: '/search?page=1' },
        { page: 1, label: '‹', url: '/search?page=1' },
        { page: 1, label: 1, url: '/search?page=1' },
        { page: 2, label: 2, url: '/search?page=2' },
        { page: 2, label: '›', url: '/search?page=2' },
        { page: 2, label: '»', url: '/search?page=2' },
      ]);
    });
  });

  describe('more than 10 pages', () => {
    const requestUrl = url.parse('/search');
    const perPage = 10;
    const maxPages = 100;
    const totalCount = perPage * 50;

    it('works on the beginning of the page list', () => {
      const currentPage = 3;
      const pagination = generatePaginationLinks(
        requestUrl, currentPage,
        perPage, maxPages,
        totalCount
      );

      should(pagination).deepEqual([
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
      ]);
    });

    it('works on the middle of the page list', () => {
      const currentPage = 25;
      const pagination = generatePaginationLinks(
        requestUrl, currentPage,
        perPage, maxPages,
        totalCount
      );

      should(pagination).deepEqual([
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
      ]);
    });

    it('works on the end of the page list', () => {
      const currentPage = 50;
      const pagination = generatePaginationLinks(
        requestUrl, currentPage,
        perPage, maxPages,
        totalCount
      );

      should(pagination).deepEqual([
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
      ]);
    });
  });

  describe('more than 100 pages', () => {
    it('should limit to 100 pages', () => {
      const requestUrl = url.parse('/search');
      const currentPage = 1;
      const perPage = 10;
      const maxPages = 100;
      const totalCount = perPage * 1000;
      const pagination = generatePaginationLinks(
        requestUrl, currentPage,
        perPage, maxPages,
        totalCount
      );

      should(pagination[pagination.length - 1].page).eql(100);
    });
  });
});
