$(document).ready(function () {
	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();

	// renderData function
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
				<input type="checkbox" class="row-checkbox" id="${part.id}">
				<label for="${part.id}"></label>
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
	  
	
	  }
	
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


	// Function to GET data from the backend API
	    // Function to handle the click event on page number links
		$('.page-number').click(function () {
			const pageId = $(this).attr('page-id'); // Get the page-id value from the clicked link
			fetchData(pageId); // Fetch data with the specified page-id
		});
		
		let filteredData = [];
		
		function fetchData(pageId) {
			const apiEndpoint = filteredData.length > 0 ?
				'http://localhost:5000/api/filter_search_part_master_api' :
				'http://localhost:5000/api/get_data_api';
		
			const requestData = {
				page: pageId, // Change the parameter name to 'page'
			};
		
			$.ajax({
				url: apiEndpoint,
				type: 'GET',
				data: requestData, // Send the data object directly
				contentType: 'application/json',
				success: function (data) {
					// Handle success
					renderData(data);
				},
				error: function (error) {
					console.error('Error fetching data:', error);
				},
			});
		}
	// Fetch data on page load if both search fields are empty
    const initialPartNumber = $('#part-number-field').val().trim();
    const initialPartDescription = $('#part-description-field').val().trim();
    if (!initialPartNumber && !initialPartDescription) {
        fetchData();
    }	

	// Function to handle the search button click
	$('#search-part').click(function () {
		const partNumber = $('#part-number-field').val().trim();
		const partDescription = $('#part-description-field').val().trim();
	
		if (partNumber || partDescription) {
		// Fetch data using the filter API
		$.ajax({
			url: 'http://localhost:5000/api/filter_search_part_master_api',
			type: 'GET',
			data: {
				search_part_no:partNumber,
				search_part_description: partDescription
			},
			success: function (data) {
				filteredData = data; // Store the filtered data
				renderData(filteredData); // Render the filtered data
			},
			error: function (error) {
				console.error('Error fetching filtered data:', error);
			},
		});
		} else {
		// If both search fields are empty, reset filtering
			filteredData = [];
			fetchData(); // Fetch all data
		}
	}); 
  
  

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
				// location.reload();

			//update the row
			function updateTableRow(response) {
				// Find the table row with the corresponding data-id
				var rowToUpdate = $('table tbody').find(`tr[data-id="${response.id}"]`);
			
				// Update the row with the new data
				rowToUpdate.find('td').eq(1).text(response.part_no);
				rowToUpdate.find('td').eq(2).text(response.part_description);
				rowToUpdate.find('td').eq(3).text(response.latest_date);
			}

			updateTableRow(response);


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
				$('#batchDeletePartModal').modal('hide');

				// Refresh the page
				location.reload();
			},
			error: function(xhr, status, error) {
				// handle error response
				console.error(error);
			}
		});
	});

// Handle batch delete and DELETE request

// Get all checked checkboxes
var checkedCheckboxes = $('input.row-checkbox:checked');

// Create an array to store the IDs of the rows to be deleted
var idsToDelete = [];

// Loop through each checked checkbox and add its ID to the array
checkedCheckboxes.each(function() {
    idsToDelete.push($(this).attr('id'));
});

// console.log(idsToDelete);

// Send the AJAX request to delete the rows
$('#submit-batch-data-delete').on('click', function(event) {
	event.preventDefault();
	// Get all checked checkboxes
	var checkedCheckboxes = $('input.row-checkbox:checked');

	// Create an array to store the IDs of the rows to be deleted
	var idsToDelete = [];

	// Loop through each checked checkbox and add its ID to the array
	checkedCheckboxes.each(function() {
		idsToDelete.push($(this).attr('id'));
	});

	// console.log(idsToDelete);
	// Get the data-id attribute of the row associated with the clicked button
	$.ajax({
		url: 'http://localhost:5000/api/delete_data_api',
		type: 'DELETE',
		data: JSON.stringify({ ids: idsToDelete }),
		contentType: 'application/json',
		success: function(response) {
			// Handle successful deletion here
			console.log(response);
					// Refresh the page
			location.reload();
		},
		error: function(xhr, status, error) {
			// Handle error here
			console.error(error);
		// Refresh the page
		location.reload();
		}
	});
});

//handling auto-complete for Part Number/Description

// auto-complete for Part Number, populate Part Description

	$(function () {
		var getData = function (request, response) {
			$.getJSON(
				"http://localhost:5000/api/auto_complete_filter_part_no_api",
				// { term: request.term }, // Pass the term as a query parameter
				{ search_part_no: request.term }, // Pass the term as a query parameter
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
				"http://localhost:5000/api/auto_complete_filter_part_name_for_part_no_api",
				{ search_part_description: ui.item.value }, // Pass the selected value as a query parameter
				function (data) {
					$("#part-description-field").val(data.part_description);
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

	$(function () {
		var getData = function (request, response) {
			$.getJSON(
				"http://localhost:5000/api/auto_complete_filter_part_name_api",
				{ search_part_description: request.term }, // Pass the term as a query parameter
				function (data) {
					var items = []; // Array to store the autocomplete suggestions
					$.each(data, function (index, item) {
						items.push(item.part_description); // Extract the relevant field from the response
					});
					response(items);
				}
			);
		};

		var selectItem = function (event, ui) {
			$("#part-description-field").val(ui.item.value);

			// Make an additional AJAX request to retrieve the part no based on the selected value
			$.getJSON(
				"http://localhost:5000/api/auto_complete_filter_part_no_for_part_name_api",
				{ search_part_no: ui.item.value }, // Pass the selected value as a query parameter
				function (data) {
					$("#part-number-field").val(data.part_no);
				}
			);
		};

		$("#part-description-field").autocomplete({
			source: getData,
			select: selectItem,
			minLength: 3
			});
		});

	



// ==========================================================
// ***pagination section***
// ==========================================================

// source : https://codepen.io/dipsichawan/pen/poyxxVY

var entriesPerPage = 10;
var currentPage = 1;
var totalEntries = 0; // Initialize with 0 initially
var totalPages = 0;

fetchPaginationEntriesCount();

function fetchPaginationEntriesCount() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:5000/api/pagination_entries_api',
        dataType: 'json',
        success: function(response) {
            totalEntries = response[0].count;
            totalPages = Math.ceil(totalEntries / entriesPerPage);

            createPagination(currentPage); // Call createPagination here
        }
    });
}

function createPagination(currentPage) {
    $("#page_container").html("");

    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, startPage + 4);

    if (currentPage > totalPages - 3) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - 4);
    }

    if (currentPage == 1) {
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>&laquo;&laquo;</a></li>");
    } else {
        $("#page_container").append("<li class='page-item' onclick='makeCall(1)'><a href='javascript:void(0)' class='page-link'>&laquo;&laquo;</a></li>");
    }

    if (currentPage == 1) {
        $("#page_container").append("<li class='page-item disabled previous'><a href='javascript:void(0)' class='page-link'><</a></li>");
    } else {
        $("#page_container").append("<li class='page-item' onclick='makeCall(" + (currentPage - 1) + ")'><a href='javascript:void(0)' class='page-link'><</a></li>");
    }

    for (var page = startPage; page <= endPage; page++) {
        if (currentPage == page) {
            $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' page-id='" + page + "' class='page-link'>" + page + "</a></li>");
        } else {
            $("#page_container").append("<li class='page-item'><a href='javascript:void(0)' class='page-link page-number' page-id='" + page + "'>" + page + "</a></li>");
        }
    }

    if (currentPage == totalPages) {
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>></a></li>");
    } else {
        $("#page_container").append("<li class='page-item next' onclick='makeCall(" + (currentPage + 1) + ")'><a href='javascript:void(0)' class='page-link'>></a></li>");
    }

    if (currentPage == totalPages) {
        $("#page_container").append("<li class='page-item disabled'><a href='javascript:void(0)' class='page-link'>&raquo;&raquo;</a></li>");
    } else {
        $("#page_container").append("<li class='page-item' onclick='makeCall(" + totalPages + ")'><a href='javascript:void(0)' class='page-link'>&raquo;&raquo;</a></li>");
    }
}



function makeCall(newPage) {
    currentPage = newPage;
    fetchData(currentPage); // Call fetchData() with the new page number
}





// Attach the click event handler to the page number buttons
$("#page_container").on("click", ".page-number", function() {
    var newPage = parseInt($(this).attr("page-id"));
    fetchData(newPage); // Call fetchData() when a page number is clicked
});

// Call createPagination initially with the desired starting page
createPagination(currentPage);

});
  