$(function () {
    // Toggle sidebar visibility
    $("#toggle-btn").on("click", function () {
      $("#sidebar").toggleClass("active");
      $("#content").toggleClass("content-expanded");
    });
  });
  
  