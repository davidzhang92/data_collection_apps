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
	  
		data.forEach(function (defect) {
	
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
	  
	
	var row = `<tr data-id="${defect.id}">
			<td>
			  <span class="custom-checkbox">
				<input type="checkbox" class="row-checkbox" id="${defect.id}">
				<label for="${defect.id}"></label>
			  </span>
			</td>
			<td>${defect.defect_no}</td>
			<td>${defect.defect_description}</td>
			<td>${defect.latest_date}</td>
			<td>
			  <a href="#editDefectModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
			  <a href="#deleteDefectModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
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
				'http://localhost:4000/api/get_filter_search_defect_master_api' :
				'http://localhost:4000/api/get_defect_api';
		
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
    const initialDefectNumber = $('#defect-number-field').val().trim();
    const initialDefectDescription = $('#defect-description-field').val().trim();
    if (!initialDefectNumber && !initialDefectDescription) {
        fetchData();
    }	

	// Function to handle the search button click
	$('#search-defect').click(function () {
		const defectNumber = $('#defect-number-field').val().trim();
		const defectDescription = $('#defect-description-field').val().trim();
	
		if (defectNumber || defectDescription) {
			// Hide the pagination container
			$('#page_container').hide();
		} else {
			// If both search fields are empty, reset filtering and show the pagination container
			filteredData = [];
			$('#page_container').show(); // Show the pagination container
		}
		
		if (defectNumber || defectDescription) {
		// Fetch data using the filter API
		$.ajax({
			url: 'http://localhost:4000/api/filter_search_defect_master_api',
			type: 'GET',
			data: {
				search_defect_no:defectNumber,
				search_defect_description: defectDescription
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
		var editDefectNumber = row.find('td').eq(1).text();
		var editDefectDescription = row.find('td').eq(2).text();

		// Set the value of the part number and part description fields in the edit dialog
		$('#edit-defect-number').val(editDefectNumber);
		$('#edit-defect-description').val(editDefectDescription);

		// Set the data-id attribute of the submit button to the current id
		$('#submit-data-edit').data('id', addCurrentId);
	});



	// handing PATCH request

	var addCurrentId;

	$(document).on('click', 'a.edit', function() {
		// Get the data-id of the parent row of the clicked button
		addCurrentId = $(this).parents('tr').data('id');
	});

	$('.edit-form').on('submit', function(event) {
		event.preventDefault();

		var editDefectNumber = $('#edit-defect-number').val();
		var editDefectDescription = $('#edit-defect-description').val();

		$.ajax({
			url: 'http://localhost:4000/api/update_defect_api',
			type: 'PATCH',
			data: JSON.stringify({
				id: addCurrentId,
				defect_no: editDefectNumber,
				defect_description: editDefectDescription
			}),
			contentType: 'application/json',
			success: function(response) {
				// handle successful response
				console.log(response);

				// Close the edit dialog box
				$('#editDefectModal').modal('hide');

				// Refresh the page
				// location.reload();

			//update the row
			function updateTableRow(response) {
				// Find the table row with the corresponding data-id
				var rowToUpdate = $('table tbody').find(`tr[data-id="${response.id}"]`);
			
				// Update the row with the new data
				rowToUpdate.find('td').eq(1).text(response.defect_no);
				rowToUpdate.find('td').eq(2).text(response.defect_description);
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
	

	$('.submit-form').on('submit', function(event) {
		event.preventDefault();

		var addDefectNumber = $('#add-defect-number').val();
		var addDefectDescription = $('#add-defect-description').val();

		// Get the data-id attribute of the row associated with the clicked button

		// var currentId = $(this).data('id');


		$.ajax({
			url: 'http://localhost:4000/api/post_defect_api',
			type: 'POST',
			data: JSON.stringify({
				defect_no: addDefectNumber,
				defect_description: addDefectDescription
			}),
			contentType: 'application/json',
			success: function(response) {
				// handle successful response
				console.log(response);

				// Close the edit dialog box
				$('#addDefectModal').modal('hide');

				 // Clear input fields
				 $('#add-defect-number').val('');
				 $('#add-defect-description').val('');

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
			url: 'http://localhost:4000/api/delete_defect_api',
			type: 'DELETE',
			data: JSON.stringify({
				id: deleteCurrentId,
			}),
			contentType: 'application/json',
			success: function(response) {
				// handle successful response
				console.log(response);

				// Close the edit dialog box
				$('#batchDeleteDefectModal').modal('hide');

				// Store the state of the "select all" checkbox
				localStorage.setItem('selectAllState', 'unchecked');

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
		url: 'http://localhost:4000/api/delete_defect_api',
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
				"http://localhost:4000/api/auto_complete_filter_defect_no_api",
				// { term: request.term }, // Pass the term as a query parameter
				{ search_defect_no: request.term }, // Pass the term as a query parameter
				function (data) {
					var items = []; // Array to store the autocomplete suggestions
					$.each(data, function (index, item) {
						items.push(item.defect_no); // Extract the relevant field from the response
					});
					response(items);
				}
			);
		};

		var selectItem = function (event, ui) {
			$("#defect-number-field").val(ui.item.value);

			// Make an additional AJAX request to retrieve the description based on the selected value
			$.getJSON(
				"http://localhost:4000/api/auto_complete_filter_defect_name_for_defect_no_api",
				{ search_defect_description: ui.item.value }, // Pass the selected value as a query parameter
				function (data) {
					$("#defect-description-field").val(data.defect_description);
				}
			);
		};

		$("#defect-number-field").autocomplete({
			source: getData,
			select: selectItem,
			minLength: 2
			});
		});

	// auto-complete for  Part Description, populate Part Number

	$(function () {
		var getData = function (request, response) {
			$.getJSON(
				"http://localhost:4000/api/auto_complete_filter_defect_name_api",
				{ search_defect_description: request.term }, // Pass the term as a query parameter
				function (data) {
					var items = []; // Array to store the autocomplete suggestions
					$.each(data, function (index, item) {
						items.push(item.defect_description); // Extract the relevant field from the response
					});
					response(items);
				}
			);
		};

		var selectItem = function (event, ui) {
			$("#defect-description-field").val(ui.item.value);

			// Make an additional AJAX request to retrieve the part no based on the selected value
			$.getJSON(
				"http://localhost:4000/api/auto_complete_filter_defect_no_for_defect_name_api",
				{ search_part_no: ui.item.value }, // Pass the selected value as a query parameter
				function (data) {
					$("#defect-number-field").val(data.delete_no);
				}
			);
		};

		$("#defect-description-field").autocomplete({
			source: getData,
			select: selectItem,
			minLength: 2
			});
		});

	



// ==========================================================
// ***pagination section***
// ==========================================================
function updatePaginationButtons(currentPage) {
    $('.page-number').removeClass('active');
    $('.page-number').eq(currentPage - 1).addClass('active');

    $('#prevPage').toggleClass('disabled', currentPage === 1);
    $('#nextPage').toggleClass('disabled', currentPage === totalPages);
    $('#firstPage').toggleClass('disabled', currentPage === 1);
    $('#lastPage').toggleClass('disabled', currentPage === totalPages);
}

let totalEntries = 0;
const entriesPerPage = 10;
let totalPages = 0;
let currentPage = 1;

// Initial fetch of pagination entries count and creation of pagination
fetchPaginationEntriesCount();

// Function to fetch the total entries count from the API
function fetchPaginationEntriesCount() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:4000/api/pagination_defect_entries_api',
        dataType: 'json',
        success: function (response) {
            totalEntries = response[0].count;
            totalPages = Math.ceil(totalEntries / entriesPerPage);
            createPagination(currentPage);
        },
        error: function (xhr, status, error) {
            console.log("API request failed:", error);
        }
    });
}

// Function to create pagination buttons
function createPagination(currentPage) {
    // Calculate the range of page numbers to display
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Create the pagination buttons HTML
    let paginationHTML = '';

    paginationHTML += `<li class="page-item" id="firstPage"><a href="#" class="page-link">First</a></li>`;
    paginationHTML += `<li class="page-item" id="prevPage"><a href="#" class="page-link">Previous</a></li>`;

    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="page-item active"><a href="#" class="page-link page-number">${i}</a></li>`;
        } else {
            paginationHTML += `<li class="page-item"><a href="#" class="page-link page-number">${i}</a></li>`;
        }
    }

    paginationHTML += `<li class="page-item" id="nextPage"><a href="#" class="page-link">Next</a></li>`;
    paginationHTML += `<li class="page-item" id="lastPage"><a href="#" class="page-link">Last</a></li>`;

    // Update the HTML of the page container with the generated pagination buttons
    $('#page_container').html(paginationHTML);
}

// Event handler for clicking a page number
$(document).on('click', '.page-number', function () {
    currentPage = parseInt($(this).text());
    createPagination(currentPage); // Update the pagination buttons
    updatePaginationButtons(currentPage); // Update the active page highlight
    fetchData(currentPage);
});

// Event handler for clicking the "Previous" button
$(document).on('click', '#prevPage', function () {
    if (currentPage > 1) {
        currentPage--;
        createPagination(currentPage);
        updatePaginationButtons(currentPage);
        fetchData(currentPage);
    }
});

// Event handler for clicking the "Next" button
$(document).on('click', '#nextPage', function () {
    if (currentPage < totalPages) {
        currentPage++;
        createPagination(currentPage);
        updatePaginationButtons(currentPage);
        fetchData(currentPage);
    }
});

// Event handler for clicking the "First" button
$(document).on('click', '#firstPage', function () {
    if (currentPage !== 1) {
        currentPage = 1;
        createPagination(currentPage);
        updatePaginationButtons(currentPage);
        fetchData(currentPage);
    }
});

// Event handler for clicking the "Last" button
$(document).on('click', '#lastPage', function () {
    if (currentPage !== totalPages) {
        currentPage = totalPages;
        createPagination(currentPage);
        updatePaginationButtons(currentPage);
        fetchData(currentPage);
    }
});

	// Check the stored state of the "select all" checkbox and update it
	var selectAllState = localStorage.getItem('selectAllState');
	if (selectAllState === 'checked') {
		$("#selectAll").prop("checked", true);
	} else {
		$("#selectAll").prop("checked", false);
	}  

// // Function to handle the search button click
// $('#search-part').click(function () {
//     const partNumber = $('#part-number-field').val().trim();
//     const partDescription = $('#part-description-field').val().trim();

//     if (partNumber || partDescription) {
//         // Hide the pagination container
//         $('#page_container').hide();

//         // Fetch data using the filter API
//         $.ajax({
//             url: 'http://localhost:4000/api/filter_search_part_master_api',
//             type: 'GET',
//             data: {
//                 search_part_no: partNumber,
//                 search_part_description: partDescription
//             },
//             success: function (data) {
//                 filteredData = data; // Store the filtered data
//                 renderData(filteredData); // Render the filtered data
//             },
//             error: function (error) {
//                 console.error('Error fetching filtered data:', error);
//             },
//         });
//     } else {
//         // If both search fields are empty, reset filtering
//         filteredData = [];
//         fetchData(); // Fetch all data

//         // Show the pagination container
//         $('#page_container').show();
//     }
// });
	
});


