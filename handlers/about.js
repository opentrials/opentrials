'use strict';

function about(request, reply) {
  reply.view('about', {
    title: 'About',
  });
}

module.exports = {
  handler: about,
};
