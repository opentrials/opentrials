'use strict';

const should = require('should');
const config = require('../../config');
const server = require('../../server');
const DataContribution = require('../../models/data-contribution');


describe('contribute-data handler', () => {
  describe('GET /contribute-data', () => {

    it('is successful', () => {
      return server.inject('/contribute-data')
        .then((response) => {
          const context = response.request.response.source.context;
          should(response.statusCode).equal(200);
          should(response.request.response.source.template).equal('contribute-data');
          should(context.s3).have.keys([
            'action',
            'fields',
          ]);
        })
    });

    it('adds "comments" field to the S3 Policy', () => {
      return server.inject('/contribute-data')
        .then((response) => {
          const context = response.request.response.source.context;
          const policyBase64 = context.s3.fields.Policy
          const policy = JSON.parse(new Buffer(policyBase64, 'base64'));

          should(policy.conditions).containEql(['starts-with', '$comments', '']);
        });

    });
  });

  describe('POST /contribute-data', () => {
    const originalS3Config = Object.assign({}, config.s3);

    before(clearDB);

    afterEach(() => {
      config.s3 = Object.assign({}, originalS3Config);
      return clearDB();
    });

    it('creates the DataContribution with related User and Trial', () => {
      delete config.s3.customDomain;
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf'
      const dataUrl = `https://opentrials-test.s3.amazonaws.com/${dataKey}`;
      const response = `
        <?xml version="1.0" encoding="UTF-8"?>
        <PostResponse>
          <Location>${dataUrl}</Location>
          <Key>${dataKey}</Key>
        </PostResponse>
      `;
      const trialId = '11111111-1111-1111-1111-111111111111';
      const options = {
        url: `/contribute-data?trial_id=${trialId}`,
        method: 'post',
        payload: {
          response,
          comments: 'A test PDF',
        },
      };

      return factory.create('user')
        .then((user) => {
          options.credentials = user.toJSON();
          return server.inject(options)
        })
        .then((response) => {
          should(response.statusCode).equal(302);
          should(response.headers.location).equal('/');
          should(response.request.yar.flash('success')).not.be.empty();
          should(response.request.yar.flash('error')).be.empty();
        })
        .then(() => new DataContribution({ url: dataUrl }).fetch({ require: true }))
        .then((dataContribution) => {
          should(dataContribution.toJSON()).containEql({
            url: dataUrl,
            trial_id: trialId,
            user_id: options.credentials.id,
            comments: options.payload.comments,
          });
        });
    });

    it('doesn\'t require neither a User nor a Trial', () => {
      delete config.s3.customDomain;
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf'
      const dataUrl = `https://opentrials-test.s3.amazonaws.com/${dataKey}`;
      const response = `
        <?xml version="1.0" encoding="UTF-8"?>
        <PostResponse>
          <Location>${dataUrl}</Location>
          <Key>${dataKey}</Key>
        </PostResponse>
      `;
      const options = {
        url: '/contribute-data',
        method: 'post',
        payload: {
          response,
          comments: 'A test PDF',
        },
      };

      return new DataContribution({ url: dataUrl }).fetch()
        .then((dataContribution) => should(dataContribution).be.null())
        .then(() => server.inject(options))
        .then(() => new DataContribution({ url: dataUrl }).fetch({ require: true }));
    });

    it('redirects to the redirectTo query param when successful', () => {
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf'
      const dataUrl = `https://opentrials-test.s3.amazonaws.com/${dataKey}`;
      const response = `
        <?xml version="1.0" encoding="UTF-8"?>
        <PostResponse>
          <Location>${dataUrl}</Location>
          <Key>${dataKey}</Key>
        </PostResponse>
      `;
      const options = {
        url: '/contribute-data?redirectTo=/foo',
        method: 'post',
        payload: {
          response,
        },
      };

      return server.inject(options)
        .then((response) => {
          should(response.statusCode).equal(302);
          should(response.headers.location).equal('/foo');
        });
    }); 

    it('handles S3 errors', () => {
      const response = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Error>
          <Code>ErrorCode</Code>
          <Message>ErrorMessage</Message>
        </Error>
      `;
      const responseStatus = '501';
      const options = {
        url: '/contribute-data',
        method: 'post',
        payload: {
          response,
          responseStatus,
        },
      };

      return server.inject(options)
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.flash.error).not.be.empty();
          should(response.statusCode).equal(Number(responseStatus));
        });
    });

    it('handles validation errors', () => {
      const options = {
        url: '/contribute-data',
        method: 'post',
      };

      return server.inject(options)
        .then((response) => should(response.statusCode).equal(400));
    }); 

    it('handles invalid XML response errors', () => {
      const options = {
        url: '/contribute-data',
        method: 'post',
        payload: {
          response: 'Invalid XML',
        },
      };

      return server.inject(options)
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.flash.error).not.be.empty();
          should(response.request.response.source.template).equal('contribute-data');
          should(response.statusCode).equal(500)
        });
    }); 

    it('handles general errors', () => {
      delete config.s3.customDomain;
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf'
      const dataUrl = `https://opentrials-test.s3.amazonaws.com/${dataKey}`;
      const response = `
        <?xml version="1.0" encoding="UTF-8"?>
        <PostResponse>
          <Location>${dataUrl}</Location>
          <Key>${dataKey}</Key>
        </PostResponse>
      `;
      const options = {
        url: '/contribute-data',
        method: 'post',
        payload: {
          response,
        },
      };

      return new DataContribution({ url: dataUrl }).save()
        .then(() => server.inject(options))
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.flash.error).not.be.empty();
          should(response.request.response.source.template).equal('contribute-data');
          should(response.statusCode).equal(500)
        });
    }); 

    it('uses the S3_CUSTOM_DOMAIN if it exists', () => {
      config.s3.customDomain = 'http://foobar.com';
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf'
      const dataUrl = `https://opentrials-test.s3.amazonaws.com/${dataKey}`;
      const expectedUrl = `${config.s3.customDomain}/${dataKey}`;
      const response = `
        <?xml version="1.0" encoding="UTF-8"?>
        <PostResponse>
          <Location>${dataUrl}</Location>
          <Key>${dataKey}</Key>
        </PostResponse>
      `;
      const options = {
        url: '/contribute-data',
        method: 'post',
        payload: {
          response,
        },
      };

      return new DataContribution({ url: expectedUrl }).fetch()
        .then((dataContribution) => should(dataContribution).be.null())
        .then(() => server.inject(options))
        .then(() => new DataContribution({ url: expectedUrl }).fetch({ require: true }));
    });
  });
});
