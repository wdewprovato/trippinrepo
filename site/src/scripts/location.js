$(function () {
  // Initialize DataTable ---------------------------------------
  var table = $("#locationsTable").DataTable({
    ajax: {
      url: "/api/locations",
      type: "GET",
      dataSrc: "data",
    },
    layout: {
      topStart: {
        buttons: [
          {
            extend: "colvis",
            columns: ":not(.noVis)",
            popoverTitle: "Columns",
          },
        ],
      },
    },
    responsive: true,
    rowReorder: true,
    select: true,
    columns: [
      { data: "location"},
      { data: "house", visible: false },
      { data: "street", visible: false },
      { data: "city" },
      { data: "state" },
      { data: "postcode", visible: false },
      { data: "region" },
      {
        data: null,
        render: function (data, type, row) {
          return `
                <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id}" 
                    data-location="${row.location}" data-address="${row.address}"
                    data-house="${row.house}" data-street="${row.street}"
                    data-city="${row.city}" data-state="${row.state}" 
                    data-postcode="${row.postcode}">
                    Edit
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}">Delete</button>`;
        },
      },
    ],
  });

  // Handle Add Button Click ---------------------------------------
  $("#addLocationBtn").on("click", function () {
    var formData = {
      location: $("#location").val(),
      address: $("#address").val(),
      shortaddress: $("#shortaddress").val(),
      house: $("#house").val(),
      street: $("#street").val(),
      city: $("#city").val(),
      state: $("#state").val(),
      postcode: $("#postcode").val(),
      phone: $("#phone").val(),
      website: $("#website").val(),
      wikidata: $("#wikidata").val(),
      wikipedia: $("#wikipedia").val(),
      description: $("#description").val(),
      extra: $("#extra").val(),
      type: $("#type").val(),
      option: $("#option").val(),
      status: $("#status").val(),
      region: $("#region").val(),
      destype: $("#destype").val(),
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
        $("#addLocationForm input").val("");
        $("#findlocation").val("");
        $(".kitchen").toggleClass("d-none");
        table.ajax.reload(); 
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
          table.ajax.reload();
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
        console.log("OpenStreetMap Response:", response);
        $("#address").val(response.address);
        $("#houseNumber").val(response.houseNumber);
        $("#street").val(response.street);
        $("#city").val(response.city);
        $("#postcode").val(response.postcode);
        $("#location").val(searchQuery);
        $(".kitchen").toggleClass("d-none");
        if (response.state) {
          var stateDropdown = $("#state");
          var matchedOption = stateDropdown.find(`option[value="${response.state}"]`);

          if (matchedOption.length) {
            stateDropdown.val(response.state).trigger("change");
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

  // Auto-suggestions ---------------------------------------
  let debounceTimer; // Timer for debouncing
  $("#findlocation").on("input", function () {
    clearTimeout(debounceTimer);

    var query = $(this).val().trim();

    if (!$("#enableAutoSuggest").prop("checked")) {
      $("#suggestions").empty();
      $("#loadingSpinner").hide();
      return;
    }

    if (query.length < 3) {
      $("#suggestions").empty();
      $("#loadingSpinner").hide();
      return;
    }

    debounceTimer = setTimeout(() => {
      $("#loadingSpinner").show();

      $.ajax({
        url: "/api/autosuggest",
        type: "GET",
        data: { q: query },
        success: function (response) {
          $("#suggestions").empty();
          $("#loadingSpinner").hide();

          if (response.length === 0) {
            $("#suggestions").append('<li class="list-group-item">No results found</li>');
            return;
          }

          response.forEach(function (place) {
            $("#suggestions").append(`<li class="list-group-item suggestion-item" data-address='${JSON.stringify(place.address)}'>${place.display_name}</li>`);
          });

          // Handle clicking a suggestion
          $(".suggestion-item").on("click", function () {
            var address = $(this).data("address");

            $("#address").val(address.road || "");
            $("#houseNumber").val(address.house_number || "");
            $("#street").val(address.road || "");
            $("#city").val(address.city || address.town || address.village || "");
            $("#postcode").val(address.postcode || "");

            var state = address.state || "";
            var matchedOption = $("#state").find(`option[value="${state}"]`);
            if (matchedOption.length) {
              $("#state").val(state).trigger("change");
            }

            $("#suggestions").empty();
          });
        },
        error: function (xhr, status, error) {
          console.error("Error fetching suggestions:", error);
          $("#loadingSpinner").hide();
        },
      });
    }, 300);
  });

  // Hide suggestions when clicking outside
  $(document).on("click", function (event) {
    if (!$(event.target).closest("#findlocation, #suggestions").length) {
      $("#suggestions").empty();
    }
  });

  // Hide suggestions when clicking outside
  // Function to Reload Page
  $("#washLocationBtn").on("click", function () {
    location.reload();
  });

  // Function to toggle kitchen sink
  $("#kitchenLocationBtn").on("click", function () {
    $(".kitchen").toggleClass("d-none");
  });

  // Function to refresh datatable
  $("#rinseLocationBtn").on("click", function() {
    $('#locationsTable').DataTable().ajax.reload();
  });
});

