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
});
