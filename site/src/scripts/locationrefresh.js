$(function () {
  console.log("Initializing DataTable...");
  var table = $("#locationsTable").DataTable({
    processing: true, // Show loading indicator
    serverSide: false,
    ajax: {
      url: "/api/locations",
      type: "GET",
      dataSrc: "data",
      error: function (xhr, status, error) {
        console.error("AJAX error:", status, error);
      },
    },
    columns: [{ data: "id" }, { data: "location" }, { data: "address" }, { data: "house" }, { data: "street" }, { data: "city" }, { data: "state" }, { data: "postcode" }],
  });
});
