'use strict';

const OAuthCredential = require('../../models/oauth-credential');

describe('OAuthCredential', () => {
  describe('#createIfInexistent', () => {
    before(clearDB);

    afterEach(clearDB);

    it('returns existing OAuthCredential if it exists', () => {
      let oauthCredential;

      return factory.create('oauthCredential')
        .then((_oauthCredential) => {
          oauthCredential = _oauthCredential;
          return new OAuthCredential().createIfInexistent(oauthCredential.toJSON());
        }).then((_oauthCredential) => {
          _oauthCredential.toJSON().should.deepEqual(oauthCredential.toJSON());
        });
    });

    it('creates new OAuthCredential if one doesn\'t exist', () => factory.build('oauthCredential')
        .then((oauthCredential) => new OAuthCredential().createIfInexistent(oauthCredential.toJSON()))
        .then((oauthCredential) => new OAuthCredential({
          provider: oauthCredential.attributes.provider,
          id: oauthCredential.attributes.id,
        }).fetch({ require: true })));

    it('rejects promise if there was some error creating the OAuthCredential', () => (new OAuthCredential().createIfInexistent({})).should.be.rejected());
  });

  describe('#user', () => {
    it('defines a belongsTo relationship', () => {
      new OAuthCredential().user().relatedData.type.should.eql('belongsTo');
    });
  });
});
