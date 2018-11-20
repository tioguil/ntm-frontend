(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle").on('click',function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });


})(jQuery); // End of use strict

(function(){  
    $('#textdiv').animate({scrollTop: $('#textdiv').prop("scrollHeight")}, 500);
    
});
