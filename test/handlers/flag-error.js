'use strict';

describe('flag handler', () => {
  let server;

  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /flag-error', () => {
    it('redirects to Google Forms passing the received URL encoded', () => {
      const sourceURL = 'http://explorer.opentrials.net/about';

      return server.inject(`/flag-error?url=${sourceURL}`)
        .then((response) => {
          const encodedURL = encodeURIComponent(sourceURL);
          response.statusCode.should.equal(302);
          response.headers.location.should.endWith(encodedURL);
        });
    });

    it('does not pass the received URL if it is undefined', () => server.inject('/flag-error')
        .then((response) => {
          response.headers.location.should.not.containEql('entry');
        }));
  });
});
