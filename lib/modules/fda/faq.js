'use strict';

function faq(request, reply) {
  reply.view('fda/faq', {
    title: 'Frequently Asked Questions about OpenTrialsFDA',
  });
}

module.exports = {
  handler: faq,
};
