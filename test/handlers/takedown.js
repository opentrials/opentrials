'use strict';
const server = require('../../server');


describe('takedown handler', () => {
  describe('GET /takedown', () => {

    it('redirects to Google Forms passing the received URL encoded', () => {
      const sourceURL = 'http://explorer.opentrials.net/about';

      return server.inject(`/takedown?url=${sourceURL}`)
        .then((response) => {
          const encodedURL = encodeURIComponent(sourceURL);
          response.statusCode.should.equal(302);
          response.headers.location.should.endWith(encodedURL);
        });
    });

    it('does not pass the received URL if it is undefined', () => {
      return server.inject('/takedown')
        .then((response) => {
          response.headers.location.should.not.containEql('entry');
        });
    });

  });
});
