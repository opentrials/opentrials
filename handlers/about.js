'use strict';

function about(request, reply) {
  const title = 'Learn more about OpenTrials';

  reply.view('about', {
    title,
    description: title,
  });
}

module.exports = {
  handler: about,
};
