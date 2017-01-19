'use strict';

const sendErrorsToSentry = require('../../../lib/plugins').sendErrorsToSentry;

describe('sendErrorsToSentry', () => {
  it('should capture the response error if it is a Boom response', (done) => {
    const request = {
      response: {
        isBoom: true,
        output: {
          payload: {
            statusCode: 500,
          },
        },
      },
    };
    const reply = {
      continue: () => {},
    };
    const hapiRaven = {
      client: {
        captureError: (response) => {
          response.should.eql(request.response);
          done();
        },
      },
    };

    sendErrorsToSentry(hapiRaven)(request, reply);
  });

  it('should not send the response if its status code is < 500', (done) => {
    const request = {
      response: {
        isBoom: false,
        output: {
          payload: {
            statusCode: 404,
          },
        },
      },
    };
    const reply = {
      continue: done,
    };
    const hapiRaven = {
      client: {
        captureError: () => {
          throw Error('Unexpected call to .captureError()');
        },
      },
    };

    sendErrorsToSentry(hapiRaven)(request, reply);
  });

  it('should not send the response if it is not a Boom response', (done) => {
    const request = {
      response: {
        isBoom: false,
        output: {
          payload: {
            statusCode: 500,
          },
        },
      },
    };
    const reply = {
      continue: done,
    };
    const hapiRaven = {
      client: {
        captureError: () => {
          throw Error('Unexpected call to .captureError()');
        },
      },
    };

    sendErrorsToSentry(hapiRaven)(request, reply);
  });

  it('should simply continue the request if there is no hapiRaven plugin', (done) => {
    const request = {};
    const reply = {
      continue: done,
    };
    const hapiRaven = undefined;

    sendErrorsToSentry(hapiRaven)(request, reply);
  });
});
