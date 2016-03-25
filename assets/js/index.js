$(document).ready(function() {
  // mobile menu
   $("#menu").mmenu({
      offCanvas: {
        pageSelector: ".page",
        position  : "right"
      }
   }, {
         // configuration
         classNames: {
            selected: "active"
         }
  });

  //home page
  $( ".toggle-advanced" ).click(function() {
    $( ".advanced" ).slideToggle( "slow", function() {
      $( ".home" ).toggleClass( "advanced-search" )
    });
  });

});
