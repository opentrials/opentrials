'use strict';

function faq(request, reply) {
  reply.view('fda/faq', {
    title: 'Frequently Asked Questions',
  });
}

module.exports = {
  handler: faq,
};
