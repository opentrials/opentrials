'use strict';

function about(request, reply) {
  reply.view('fda/about', {
    title: 'Learn more about OpenTrialsFDA',
    description: `Learn more about OpenTrialsFDA, a searchable database of drug
                  approval packages (DAPs) from the FDA`,
  });
}

module.exports = {
  handler: about,
};
