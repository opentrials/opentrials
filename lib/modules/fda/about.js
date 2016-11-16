'use strict';

function about(request, reply) {
  reply.view('fda/about', {
    title: 'About',
  });
}

module.exports = {
  handler: about,
};
