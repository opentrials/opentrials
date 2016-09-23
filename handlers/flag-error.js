'use strict';

function flag(request, reply) {
  let redirectTo = 'https://docs.google.com/forms/d/e/1FAIpQLSc49nJx0Ie8q8b24yYNX2DrqIWN44P9DsF9k4Y_VkU7y81rFg/viewform';

  const url = request.query.url;
  if (url) {
    redirectTo += `?entry.783048384=${encodeURIComponent(url)}`;
  }

  return reply.redirect(redirectTo);
}

module.exports = {
  handler: flag,
};
