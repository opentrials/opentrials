'use strict';

const config = require('../../config');
const emailjs = require('emailjs');
const renderEngine = config.hapi.views.engines.html;
const marked = require('marked');

function renderTemplate(templateName, context) {
  let text = renderEngine.render('email/' + templateName, context);
  return {
    text: text,
    html: marked(text),
  };
};

function composeEmail(templateName, context, expeditor, recepient, subject) {
  const rendered = renderTemplate(templateName, context);
  return {
    text: rendered.text,
    from: expeditor,
    to: recepient,
    subject: subject,
    attachment: [{data: rendered.html, alternative: true}],
  };
};

function sendEmail(message) {
  const server = emailjs.server.connect({
    user: config.smtp.username,
    password: config.smtp.password,
    host: config.smtp.host,
    ssl: config.smtp.ssl,
  });

  server.send(message, function(err, message) {
    if (err) {
      console.warn(err);
    }
  });
};

module.exports = {
  composeEmail,
  sendEmail,
};
