const Boom = require('boom');
const trials = require('../agents/trials');

function searchPage(request, reply) {
  const query = request.query.q;

  trials.search(request.query.q).then((response) => {
    reply.view('search', {
      title: 'Search',
      query,
      results: response,
    });
  }).catch((err) => (
    reply(
      Boom.badGateway('Error accessing OpenTrials API.', err)
    )
  ));
}

module.exports = searchPage;
