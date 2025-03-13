$(function () {
  // Initialize DataTable ---------------------------------------
  var table = $("#locationsTable").DataTable({
    ajax: {
      url: "/api/locations",
      type: "GET",
      dataSrc: "data",
    },
    columns: [
      { data: "id" },
      { data: "location" },
      { data: "address" },
      { data: "house" },
      { data: "street" },
      { data: "city" },
      { data: "state" },
      { data: "postcode" },
      {
        data: null,
        render: function (data, type, row) {
          return `
                <button class="btn btn-warning edit-btn" data-id="${row.id}" 
                    data-location="${row.location}" data-address="${row.address}"
                    data-house="${row.house}" data-street="${row.street}"
                    data-city="${row.city}" data-state="${row.state}" 
                    data-postcode="${row.postcode}">
                    Edit
                </button>
                <button class="btn btn-danger delete-btn" data-id="${row.id}">Delete</button>`;
        },
      },
    ],
  });

  // Handle Add Button Click ---------------------------------------
  $("#addLocationBtn").on("click", function () {
    var formData = {
      location: $("#location").val(),
      address: $("#address").val(),
      house: $("#house").val(),
      street: $("#street").val(),
      city: $("#city").val(),
      state: $("#state").val(),
      postcode: $("#postcode").val(),
    };
    if (!formData.location) {
      alert("Location field required!");
      return;
    }
    $.ajax({
      url: "/api/locations",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function (response) {
        alert("Location added successfully!");
        $("#addLocationForm input").val(""); // Clear input fields
        table.ajax.reload(); // Refresh DataTable
      },
      error: function (xhr, status, error) {
        console.error("Error adding location:", error);
        alert("Error adding location. Check console for details.");
      },
    });
  });

  // Handle Edit Button Click ---------------------------------------
  $("#locationsTable tbody").on("click", ".edit-btn", function () {
    var locationId = $(this).data("id");
    $("#editId").val(locationId);
    $("#editLocation").val($(this).data("location"));
    $("#editAddress").val($(this).data("address"));
    $("#edithouse").val($(this).data("house"));
    $("#editStreet").val($(this).data("street"));
    $("#editCity").val($(this).data("city"));
    $("#editState").val($(this).data("state"));
    $("#editPostcode").val($(this).data("postcode"));
    $("#editLocationModal").modal("show");
  });

  // Handle Save Edit Button Click ---------------------------------------
  $("#saveEditBtn").on("click", function () {
    var updatedData = {
      id: $("#editId").val(),
      location: $("#editLocation").val(),
      address: $("#editAddress").val(),
      house: $("#edithouse").val(),
      street: $("#editStreet").val(),
      city: $("#editCity").val(),
      state: $("#editState").val(),
      postcode: $("#editPostcode").val(),
    };
    $.ajax({
      url: `/api/locations/${updatedData.id}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updatedData),
      success: function (response) {
        alert("Record updated successfully!");
        $("#editLocationModal").modal("hide");
        $("#locationsTable").DataTable().ajax.reload();
      },
      error: function (xhr, status, error) {
        console.error("Error updating record:", error);
        alert("Error updating record. Check console for details.");
      },
    });
  });
  $("#editLocationModal .close, .btn-secondary").on("click", function () {
    $("#editLocationModal").modal("hide");
  });

  // Handle Delete Button Click ---------------------------------------
  $("#locationsTable tbody").on("click", ".delete-btn", function () {
    var locationId = $(this).data("id");
    if (confirm("Are you sure you want to delete this record?")) {
      $.ajax({
        url: `/api/locations/${locationId}`,
        type: "DELETE",
        success: function (response) {
          alert("Record deleted successfully!");
          table.ajax.reload(); // Refresh DataTable
        },
        error: function (xhr, status, error) {
          console.error("Error deleting record:", error);
          alert("Error deleting record. Check console for details.");
        },
      });
    }
  });

  // Initialize States DataTable ---------------------------------------
  $("#statesTable").DataTable({
    ajax: {
      url: "/api/states",
      type: "GET",
      dataSrc: "data",
    },
    columns: [{ data: "stateabbr" }, { data: "statelong" }],
  });

  // Fetch States and Populate Dropdown ---------------------------------------
  $.ajax({
    url: "/api/states",
    type: "GET",
    success: function (response) {
      var stateDropdown = $("#state");
      response.data.forEach((state) => {
        stateDropdown.append(`<option value="${state.statelong}">${state.statelong}</option>`);
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching states:", error);
    },
  });

  // Handle "Find Address" Button Click ---------------------------------------
  $("#searchLocationBtn").on("click", function () {
    var searchQuery = $("#findlocation").val();
    if (!searchQuery) {
      alert("Please enter a location to search.");
      return;
    }
    $.ajax({
      url: "/api/findlocation",
      type: "GET",
      data: { q: searchQuery },
      success: function (response) {
        console.log("OpenStreetMap Response:", response); // Debugging
        $("#address").val(response.address);
        $("#houseNumber").val(response.houseNumber);
        $("#street").val(response.street);
        $("#city").val(response.city);
        $("#postcode").val(response.postcode);
        $("#location").val(searchQuery);
        console.log("Detected State:", response.state);
        if (response.state) {
          var stateDropdown = $("#state");
          var matchedOption = stateDropdown.find(`option[value="${response.state}"]`);

          if (matchedOption.length) {
            stateDropdown.val(response.state).trigger("change"); // Select the matching state
          } else {
            console.warn("State not found in dropdown:", response.state);
          }
        }
      },
      error: function (xhr, status, error) {
        console.error("Error finding location:", error);
        alert("Error finding location. Please try again.");
      },
    });
  });

  // Force uppercase on spot finder ---------------------------------------
  $("#findlocation").on("keyup", function (event) {
    var input_value = $(this).val();
    var capitalized_value = input_value.replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
    $(this).val(capitalized_value);
  });
});
