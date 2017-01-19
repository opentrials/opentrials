'use strict';

const should = require('should');
const config = require('../../config');
const DataContribution = require('../../models/data-contribution');
const DataCategory = require('../../models/data-category');


describe('contribute-data handler', () => {
  let server;

  before(() => getExplorerServer().then((_server) => (server = _server)));

  describe('GET /contribute-data', () => {
    it('is successful and uses the correct template', () => server.inject('/contribute-data')
        .then((response) => {
          should(response.statusCode).equal(200);
          should(response.request.response.source.template).equal('contribute-data');
        }));

    it('adds the ordered data categories to the context', () => {
      let categories;

      return factory.createMany('dataCategory', [{ name: 'z' }, { name: 'a' }])
        .then(() => new DataCategory().orderBy('name').fetchAll())
        .then((_categories) => (categories = _categories))
        .then(() => server.inject('/contribute-data'))
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.categories).deepEqual(categories.toJSON());
        });
    });

    it('adds S3\'s signed form fields to the context', () => server.inject('/contribute-data')
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.s3).have.properties([
            'action',
            'fields',
          ]);
        }));

    it('adds "comments", "url" and "data_category_id" fields to the S3 Policy', () => server.inject('/contribute-data')
        .then((response) => {
          const context = response.request.response.source.context;
          const policyBase64 = context.s3.fields.Policy;
          const policy = JSON.parse(new Buffer(policyBase64, 'base64'));

          should(policy.conditions).containDeep([
            ['starts-with', '$comments', ''],
            ['starts-with', '$url', ''],
            ['starts-with', '$data_category_id', ''],
          ]);
        }));
  });

  describe('POST /contribute-data', () => {
    const originalS3Config = Object.assign({}, config.s3);

    before(clearDB);

    afterEach(() => {
      config.s3 = Object.assign({}, originalS3Config);
      return clearDB();
    });

    it('creates the DataContribution with related User, Trial and DataCategory', () => {
      delete config.s3.customDomain;
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf';
      const dataUrl = `https://opentrials-test.s3.amazonaws.com/${dataKey}`;
      const s3Response = `
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
          response: s3Response,
          url: 'http://somewhere.com/data.pdf',
          comments: 'A test PDF',
        },
      };

      return factory.create('dataCategory')
        .then((category) => (options.payload.data_category_id = category.attributes.id))
        .then(() => factory.create('user'))
        .then((user) => (options.credentials = user.toJSON()))
        .then(() => server.inject(options))
        .then((response) => {
          should(response.statusCode).equal(302);
          should(response.headers.location).equal('/');
          should(response.request.yar.flash('success')).not.be.empty();
          should(response.request.yar.flash('error')).be.empty();
        })
        .then(() => new DataContribution({ data_url: dataUrl }).fetch({ require: true }))
        .then((dataContribution) => {
          should(dataContribution.toJSON()).containEql({
            data_url: dataUrl,
            trial_id: trialId,
            user_id: options.credentials.id,
            data_category_id: options.payload.data_category_id,
            url: options.payload.url,
            comments: options.payload.comments,
          });
        });
    });

    it('accepts anonymous contributions with only an uploaded file', () => {
      delete config.s3.customDomain;
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf';
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

      return new DataContribution({ data_url: dataUrl }).fetch()
        .then((dataContribution) => should(dataContribution).be.null())
        .then(() => server.inject(options))
        .then(() => new DataContribution({ data_url: dataUrl }).fetch({ require: true }));
    });

    it('accepts anonymous contributions with only a URL', () => {
      const sourceUrl = 'http://somewhere.com/data.pdf';
      const options = {
        url: '/contribute-data',
        method: 'post',
        payload: {
          url: sourceUrl,
        },
      };

      return new DataContribution({ url: sourceUrl }).fetch()
        .then((dataContribution) => should(dataContribution).be.null())
        .then(() => server.inject(options))
        .then(() => new DataContribution({ url: sourceUrl }).fetch({ require: true }));
    });

    it('redirects to the redirectTo query param when successful', () => {
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf';
      const dataUrl = `https://opentrials-test.s3.amazonaws.com/${dataKey}`;
      const s3Response = `
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
          response: s3Response,
        },
      };

      return server.inject(options)
        .then((response) => {
          should(response.statusCode).equal(302);
          should(response.headers.location).equal('/foo');
        });
    });

    it('handles S3 errors', () => {
      const s3Response = `
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
          response: s3Response,
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
          should(response.statusCode).equal(500);
        });
    });

    it('handles general errors', () => {
      delete config.s3.customDomain;
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf';
      const dataUrl = `https://opentrials-test.s3.amazonaws.com/${dataKey}`;
      const s3Response = `
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
          response: s3Response,
        },
      };

      return new DataContribution({ data_url: dataUrl }).save()
        .then(() => server.inject(options))
        .then((response) => {
          const context = response.request.response.source.context;
          should(context.flash.error).not.be.empty();
          should(response.request.response.source.template).equal('contribute-data');
          should(response.statusCode).equal(500);
        });
    });

    it('uses the S3_CUSTOM_DOMAIN if it exists', () => {
      config.s3.customDomain = 'http://foobar.com';
      const dataKey = 'uploads/00000000-0000-0000-0000-000000000000/data.pdf';
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

      return new DataContribution({ data_url: expectedUrl }).fetch()
        .then((dataContribution) => should(dataContribution).be.null())
        .then(() => server.inject(options))
        .then(() => new DataContribution({ data_url: expectedUrl }).fetch({ require: true }));
    });
  });
});
