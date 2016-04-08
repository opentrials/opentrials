$(document).ready(function() {
  // mobile menu
  $("#menu").mmenu({
    offCanvas: {
      pageSelector: ".page",
      position: "right",
    },
   }, {
     // configuration
     classNames: {
       selected: "active",
     },
  });

  // home page
  $(".toggle-advanced").click(function() {
    $(".advanced").slideToggle("slow", function() {
      $(".home").toggleClass("advanced-search")
    });
  });

  // clear fieldset button
  $("#clear-fieldset").click(function(ev) {
    var fieldset = $(this).parents('fieldset');
    fieldset.find('input, select, textarea')
      .val('');
    fieldset.find('input:radio, input:checkbox')
      .removeAttr('checked')
      .removeAttr('selected');
  });

  $('select[name="location"]').select2({
    ajax: {
      url: API_URL + '/search/locations',
      dataType: 'json',
      delay: 250,
      cache: true,
      data: function(params) {
        return {
          q: 'name:"' + params.term + '"',
          page: params.page,
          per_page: 10,
        };
      },
      processResults: function(data, params) {
        params.page = params.page || 1;

        return {
          results: data.items,
          pagination: {
            more: (params.page * 10) < data.total_count,
          },
        };
      },
    },
    templateResult: function (item) {
      return item.name;
    },
    templateSelection: function (item) {
      return item.name;
    },
  });
});
