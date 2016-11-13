(function() {

function setupSelect2For(name) {
  var perPage = 10;

  $('select[name="' + name + '"]').select2({
    ajax: {
      url: OPENTRIALS_API_URL + '/search/autocomplete/' + name,
      dataType: 'json',
      delay: 250,
      cache: true,
      data: function(params) {
        return {
          q: params.term,
          page: params.page,
          per_page: perPage,
        };
      },
      processResults: function(data, params) {
        var results = data.items.map(function(d) {
          return {
            id: d.name,
            text: d.name,
          };
        });
        params.page = params.page || 1;

        return {
          results: results,
          pagination: {
            more: (params.page * perPage) < data.total_count,
          },
        };
      },
    },
    tags: true,
  });
}

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
  $(".toggle-advanced").click(function(e) {
    e.preventDefault();
    $(".advanced").slideToggle("slow", function() {
      $(".home").toggleClass("advanced-search")
    });
  });

  // clear form button
  $(".clear-form").click(function(ev) {
    var form = $(this).parents('form');
    form.find('input, select, textarea')
      .val('');
    form.find('input:radio, input:checkbox')
      .removeAttr('checked')
      .removeAttr('selected');
  });

  // set up accordion
  $('.accordion').accordion({
    "transitionSpeed": 400
  });

  // set up tooltips
  $('.tooltip').tooltipster({
    functionInit: function(instance, helper){
      var content = $(helper.origin).find('.tooltip-content').detach();
      instance.content(content);
    },
    contentAsHTML: true,
    delay: [100, 2000],
    interactive: true,
  });

  setupSelect2For('condition');
  setupSelect2For('intervention');
  setupSelect2For('person');
  setupSelect2For('organisation');
  setupSelect2For('location');
});

})();
