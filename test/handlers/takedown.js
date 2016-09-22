'use strict';
const server = require('../../server');


describe('takedown handler', () => {
  describe('GET /takedown', () => {

    it('redirects to Google Forms passing the received URL', () => {
      const sourceURL = 'http://explorer.opentrials.net/about';

      return server.inject(`/takedown?url=${sourceURL}`)
        .then((response) => {
          response.statusCode.should.equal(302);
          response.headers.location.should.endWith(sourceURL);
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
