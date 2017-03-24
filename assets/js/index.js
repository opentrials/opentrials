(function () {
  'use strict';

  function setupSelect2For(name) {
    const perPage = 10;
    const input = $('select[name="' + name + '"]');
    const form = input.parents('form');

    function _submitFormIfPressedEnter(e) {
      if (e.keyCode === 13) {
        form.submit();
      }
    }

    input.select2({
      ajax: {
        url: OPENTRIALS_API_URL + '/search/autocomplete/' + name,
        dataType: 'json',
        delay: 250,
        cache: true,
        data: function (params) {
          return {
            q: params.term,
            page: params.page,
            per_page: perPage,
          };
        },
        processResults: function (data, params) {
          const results = data.items.map(function (d) {
            return {
              id: d.name,
              text: d.name,
            };
          });
          params.page = params.page || 1; // eslint-disable-line no-param-reassign

          return {
            results: results,
            pagination: {
              more: (params.page * perPage) < data.total_count,
            },
          };
        },
      },
      tags: true,
    }).on('select2:select', function () {
      form.off('keyup', '.select2-selection', _submitFormIfPressedEnter);
    }).on('select2:opening', function () {
      form.on('keyup', '.select2-selection', _submitFormIfPressedEnter);
    });
  }

  $(document).ready(function () {
    // mobile menu
    $('#menu').mmenu({
      offCanvas: {
        pageSelector: '.page',
        position: 'right',
      },
    }, {
     // configuration
      classNames: {
        selected: 'active',
      },
    });

    // home page
    $('.toggle-advanced').click(function (e) {
      e.preventDefault();
      $('.advanced').slideToggle('slow', function () {
        $('.home').toggleClass('advanced-search');
      });
    });

    // clear form button
    $('.clear-form').click(function () {
      const form = $(this).parents('form');
      form.find('input, select, textarea')
        .val('');
      form.find('input:radio, input:checkbox')
        .removeAttr('checked')
        .removeAttr('selected');
    });

    // set up expander
    $('.expander-trigger').click(function () {
      $(this).toggleClass('expander-hidden');
    });

    setupSelect2For('condition');
    setupSelect2For('intervention');
    setupSelect2For('person');
    setupSelect2For('organisation');
    setupSelect2For('location');
  });
}());
