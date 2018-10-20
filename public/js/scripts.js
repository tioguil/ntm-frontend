(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle").on('click',function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });

  $('#input-anexo').change(function() {
    $('#file-name').html(this.files[0].name);
  });

})(jQuery); // End of use strict