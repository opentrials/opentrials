'use strict';

const config = require('../../config');
const emailjs = require('emailjs');

const renderEngine = config.hapi.views.engines.html;
const marked = require('marked');

function renderTemplate(templateName, context) {
  const text = renderEngine.render(`email/${templateName}`, context);
  return {
    text,
    html: marked(text),
  };
}

function composeEmail(templateName, context, expeditor, recepient, subject) {
  const rendered = renderTemplate(templateName, context);
  return {
    text: rendered.text,
    from: expeditor,
    to: recepient,
    subject,
    attachment: [{ data: rendered.html, alternative: true }],
  };
}

function sendEmail(message) {
  const server = emailjs.server.connect({
    user: config.smtp.username,
    password: config.smtp.password,
    host: config.smtp.host,
    ssl: config.smtp.ssl,
  });

  server.send(message, (err) => {
    if (err) {
      console.warn(err);  // eslint-disable-line no-console
    }
  });
}

module.exports = {
  composeEmail,
  sendEmail,
};
