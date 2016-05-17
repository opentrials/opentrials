'use strict';

require('blueimp-file-upload/js/jquery.fileupload');


$(function() {

  $('.direct-upload').find('input:file').each(function(i, elem) {
    var fileInput = $(elem);
    var form = $(fileInput.parents('form:first'));
    var submitButton = form.find('[type="submit"]');
    var progressText = submitButton.find('.progress-text');
    var contentTypeInput = $('<input type="hidden" name="Content-Type" />').prependTo(form);

    fileInput.fileupload({
      fileInput: fileInput,
      url: form.data('url'),
      type: 'POST',
      autoUpload: false,
      multipart: true,
      replaceFileInput: false,
      add: function (e, data) {
        var contentType = data.files[0].type;
        contentTypeInput.attr('value', contentType);

        form.off('submit').on('submit', function (e) {
          e.preventDefault();
          data.submit();
        });
      },
      progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        progressText.text(progress + '%')
      },
      start: function (e) {
        submitButton.prop('disabled', true);
        progressText.text('0%')
      },
      done: _addResponseAndSubmit(form),
      fail: _addResponseAndSubmit(form),
    });
  });

  function _addResponseAndSubmit(form) {
    return function (e, data) {
      var response = $('<input />', {
        type: 'hidden',
        name: 'response',
        value: data.jqXHR.responseText,
      });
      var responseStatus = $('<input />', {
        type: 'hidden',
        name: 'responseStatus',
        value: data.jqXHR.status,
      });
      form.append(response, responseStatus);

      form.off('submit').submit();
    }
  }

});
