$(document).ready(function () {
	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();
  
	// Function to update the "Select All" checkbox state
function updateSelectAllCheckbox() {
	var allCheckboxes = $('table tbody input[type="checkbox"]');
	var checkedCount = allCheckboxes.filter(':checked').length;
	var selectAllCheckbox = $("#selectAll");
  
	if (checkedCount === allCheckboxes.length) {
	  selectAllCheckbox.prop("checked", true);
	} else {
	  selectAllCheckbox.prop("checked", false);
	}
  }
	// Select/Deselect checkboxes
	$("#selectAll").click(function () {
		var isChecked = this.checked;
		$('table tbody input[type="checkbox"]').each(function () {
		  this.checked = isChecked;
		});
	  });
	  
	  $('table').on('click', 'tbody input[type="checkbox"]', function() {
		updateSelectAllCheckbox();
	  });
  
	// Function to fetch data from the backend API
	function fetchData() {
	  $.ajax({
		url: 'http://localhost:5000/api/get_data_api', // Replace with the actual API endpoint
		type: 'GET',
		success: function (data) {
		  renderData(data); // Call the function to render the data in the table
		  updateHintText(data.length); // Update the hint-text with the total entries
		},
		error: function (error) {
		  console.error('Error fetching data:', error);
		},
	  });
	}
  
	// Function to render data in the table

function renderData(data) {
	var tableBody = $('table tbody');
	tableBody.empty(); // Clear the existing table data
  
	if (!Array.isArray(data)) {
	  console.error('Invalid data format. Expecting an array.');
	  return;
	}
  
	if (data.length === 0) {
	  console.log('No data received from the API.');
	  return;
	}
  
	data.forEach(function (part) {

// Validation data type 
	//   if (
	// 	typeof part.part_no !== 'string' ||
	// 	typeof part.part_description !== 'string' ||
	// 	typeof part.modified_date !== 'string'
	//   ) {
	// 	console.error('Invalid data format for part:', part);
	// 	console.log('part_no:', part.part_no);
	// 	console.log('part_description:', part.part_description);
	// 	console.log('modified_date:', part.modified_date);
	// 	return;
	//   }
  

var row = `<tr data-id="${part.id}">
		<td>
		  <span class="custom-checkbox">
			<input type="checkbox"  id="checkbox-${part.id}" >
			<label for="checkbox-${part.id}"></label>
		  </span>
		</td>
		<td>${part.part_no}</td>
		<td>${part.part_description}</td>
		<td>${part.latest_date}</td>
		<td>
		  <a href="#editPartModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
		  <a href="#deletePartModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
		</td>
	  </tr>`;

	  tableBody.append(row);
	});
  
	// Update the hint-text with the total entries
	updateHintText(data.length);
  }
  
  
	// Handle pagination clicks
	$('.pagination .page-link').click(function (e) {
	  e.preventDefault();
	  var pageNumber = $(this).text();
	  fetchPageData(pageNumber);
	});
  
	// Function to fetch data for a specific page number
	function fetchPageData(pageNumber) {
	  $.ajax({
		url: 'your_api_endpoint_here?page=' + pageNumber, // Replace with the actual API endpoint
		type: 'GET',
		success: function (data) {
		  renderData(data); // Call the function to render the data in the table
		  updateHintText(data.length); // Update the hint-text with the total entries
		},
		error: function (error) {
		  console.error('Error fetching data:', error);
		},
	  });
	}
  
	// Function to update the hint-text showing the number of entries
	function updateHintText(totalEntries) {
		var entriesPerPage = 10; // Assuming you display 5 entries per page
		var currentPage = $('.pagination .active').text();
		var startEntry = (currentPage - 1) * entriesPerPage + 1;
		var endEntry = Math.min(currentPage * entriesPerPage, totalEntries);
	
		// Handle cases when the API request fails or no data is received
		if (isNaN(totalEntries)) {
		  totalEntries = 0;
		}
		if (isNaN(startEntry) || isNaN(endEntry)) {
		  startEntry = 0;
		  endEntry = 0;
		}
	
		$('.hint-text').html(`Showing <b>${startEntry}</b> out of <b>${endEntry}</b> entries`);
	  }
  
	// Fetch data for the first page when the document is ready
	fetchData();
 

// Handle edit and PATCH request

	// Handle click event for edit button
	$(document).on('click', '.edit', function() {
		// Get the row associated with the clicked button
		var row = $(this).closest('tr');

		// Get the data-id attribute of the row
		var addCurrentId = row.data('id');

		// Get the part number and part description from the row
		var editPartNumber = row.find('td').eq(1).text();
		var editPartDescription = row.find('td').eq(2).text();

		// Set the value of the part number and part description fields in the edit dialog
		$('#edit-part-number').val(editPartNumber);
		$('#edit-part-description').val(editPartDescription);

		// Set the data-id attribute of the submit button to the current id
		$('#submit-data-edit').data('id', addCurrentId);
	});



	// handing PATCH request

	$('#submit-data-edit').on('click', function(event) {
		event.preventDefault();

		var editPartNumber = $('#edit-part-number').val();
		var editPartDescription = $('#edit-part-description').val();

		// Get the data-id attribute of the row associated with the clicked button
		var addCurrentId = $(this).data('id');



		$.ajax({
			url: 'http://localhost:5000/api/update_data_api',
			type: 'PATCH',
			data: JSON.stringify({
				id: addCurrentId,
				part_no: editPartNumber,
				part_description: editPartDescription
			}),
			contentType: 'application/json',
			success: function(response) {
				// handle successful response
				console.log(response);

				// Close the edit dialog box
				$('#editPartModal').modal('hide');

				// Refresh the page
				location.reload();
			},
			error: function(xhr, status, error) {
				// handle error response
				console.error(error);
			}
		});
	});


	// handing POST request

	$('#submit-data-add').on('click', function(event) {
		event.preventDefault();

		var addPartNumber = $('#add-part-number').val();
		var addPartDescription = $('#add-part-description').val();

		// Get the data-id attribute of the row associated with the clicked button

		// var currentId = $(this).data('id');


		$.ajax({
			url: 'http://localhost:5000/api/post_data_api',
			type: 'POST',
			data: JSON.stringify({
				part_no: addPartNumber,
				part_description: addPartDescription
			}),
			contentType: 'application/json',
			success: function(response) {
				// handle successful response
				console.log(response);

				// Close the edit dialog box
				$('#addPartModal').modal('hide');

				 // Clear input fields
				 $('#add-part-number').val('');
				 $('#add-part-description').val('');

				// Refresh the page
				location.reload();
			},
			error: function(xhr, status, error) {
				// handle error response
				console.error(error);
			}
		});
	});




// Handle delete and DELETE request

	// Handle click event for delete button
	$(document).on('click', '.delete', function() {
		// Get the row associated with the clicked button
		var row = $(this).closest('tr');

		// Get the data-id attribute of the row
		var deleteCurrentId = row.data('id');

		// Set the data-id attribute of the submit button to the current id
		$('#submit-data-delete').data('id', deleteCurrentId);
	});



	// handing DELETE request

	$('#submit-data-delete').on('click', function(event) {
		event.preventDefault();

		// Get the data-id attribute of the row associated with the clicked button
		var deleteCurrentId = $(this).data('id');



		$.ajax({
			url: 'http://localhost:5000/api/delete_data_api',
			type: 'DELETE',
			data: JSON.stringify({
				id: deleteCurrentId,
			}),
			contentType: 'application/json',
			success: function(response) {
				// handle successful response
				console.log(response);

				// Close the edit dialog box
				$('#deletePartModal').modal('hide');

				// Refresh the page
				location.reload();
			},
			error: function(xhr, status, error) {
				// handle error response
				console.error(error);
			}
		});
	});

//handling auto-complete for Part Number/Description

// auto-complete for Part Number, populate Part Description

$(function () {
    var getData = function (request, response) {
        $.getJSON(
            "http://localhost:5000/api/auto_complete_filter_part_no_api",
            { term: request.term }, // Pass the term as a query parameter
            function (data) {
                var items = []; // Array to store the autocomplete suggestions
                $.each(data, function (index, item) {
                    items.push(item.part_no); // Extract the relevant field from the response
                });
                response(items);
            }
        );
    };

    var selectItem = function (event, ui) {
        $("#part-number-field").val(ui.item.value);

        // Make an additional AJAX request to retrieve the description based on the selected value
        $.getJSON(
            "http://localhost:5000/api/auto_complete_filter_part_name_api",
            { pname: ui.item.value }, // Pass the selected value as a query parameter
            function (data) {
                $("#part-description-field").val(data.description);
            }
        );
    };

    $("#part-number-field").autocomplete({
        source: getData,
        select: selectItem,
        minLength: 3
		});
	});

// auto-complete for  Part Description, populate Part Number
// $(function () {
//     var getData = function (request, response) {
//         $.getJSON(
//             "http://localhost:5000/api/auto_complete_part_name_api",
//             { term: request.term }, // Pass the term as a query parameter
//             function (data) {
//                 var items = []; // Array to store the autocomplete suggestions
//                 $.each(data, function (index, item) {
//                     items.push(item.description); // Extract the relevant field from the response
//                 });
//                 response(items);
//             }
//         );
//     };

//     var selectItem = function (event, ui) {
//         $("#part-description-field").val(ui.item.value);

//         // Make an additional AJAX request to retrieve the description based on the selected value
//         $.getJSON(
//             "http://localhost:5000/api/auto_complete_part_no_api",
//             { pname: ui.item.value }, // Pass the selected value as a query parameter
//             function (data) {
//                 $("#part-number-field").val(data.part_no);
//             }
//         );
//     };

//     $("#part-description-field").autocomplete({
//         source: getData,
//         select: selectItem,
//         minLength: 3
// 		});
// 	});

});
  





