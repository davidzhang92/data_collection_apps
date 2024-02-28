$(document).ready(function () {
	// Get the token from local storage
	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip()
	$('.displayed-username').text(localStorage.getItem('userName'));

	//clear all field in modal window when it's hidden
	$('#addPartModal').on('hidden.bs.modal', function () {
		// Clear the fields here
		$('#add-part-number').val('');
		$('#add-part-description').val('');
		// Add more fields as needed
	});


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
	
	// Parse the date string
	var createDate = new Date(part.latest_date);

	// Format the date as 'YYYY-MM-DD HH:MM:SS'
	var formattedDate = createDate.toISOString().slice(0, 16).replace('T', ' ');

	// Replace 'null' with '-'
	var userName = part.username !== null ? part.username : '-';

	var row = `<tr data-id="${part.id}">
			<td>
			  <span class="custom-checkbox">
				<input type="checkbox" class="row-checkbox" id="${part.id}">
				<label for="${part.id}"></label>
			  </span>
			</td>
			<td>${part.part_no}</td>
			<td>${part.part_description}</td>
			<td>${userName}</td>
			<td>${formattedDate}</td>
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



	// Function to GET data from the backend API for pagination
	    // Function to handle the click event on page number links
		$('.page-number').click(function () {
			const pageId = $(this).attr('page-id'); // Get the page-id value from the clicked link
			fetchData(pageId); // Fetch data with the specified page-id
		});
		
		let filteredData = [];
		
		function fetchData(pageId) {
			const apiEndpoint = filteredData.length > 0 ?
				'' :
				'http://' + window.location.hostname + ':4000/api/get_part_api';
		
			const requestData = {
				page: pageId, // Change the parameter name to 'page'
			};


	
			$.ajax({
				url: apiEndpoint,
				type: 'GET',
				data: requestData, // Send the data object directly
				contentType: 'application/json',
				beforeSend: function(xhr) { 
					xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
				},	
				success: function (data) {
					// Handle success
					renderData(data);
				},
				error: function (xhr, error) {
					if (xhr.status === 401) {
						alert(xhr.responseJSON.message);
						window.location.href = '/login.html'
						localStorage.removeItem('accessToken');
					} else if (xhr.status >= 400 && xhr.status < 600) {
						alert(xhr.responseJSON.message);
					} else {
						console.error(error);
						alert('An error occurred while retrieving the data.');
					}
				},
			});
		}
	// Fetch data on page load if both search fields are empty
    const initialPartNumber = $('#part-number-field').val().trim();
    const initialPartDescription = $('#part-description-field').val().trim();
    if (!initialPartNumber && !initialPartDescription) {
        fetchData();
    }	

	// Function to reset the current page to 1
	function resetCurrentPage() {
		currentPage = 1;
		createPagination(currentPage);
		updatePaginationButtons(currentPage);
	}
	// Function to handle the search button click
	$('#search-part').click(function () {
		const partNumber = $('#part-number-field').val().trim();
		const partDescription = $('#part-description-field').val().trim();
	
		if (partNumber || partDescription) {
			// Hide the pagination container
			$('#page_container').hide();
			resetCurrentPage();
		} 
		else {
			// If both search fields are empty, reset filtering and show the pagination container
			filteredData = [];
			resetCurrentPage();
			$('#page_container').show(); // Show the pagination container
		}
	

		if (partNumber || partDescription) {
		// Fetch data using the filter API
		$.ajax({
			url: 'http://' + window.location.hostname + ':4000/api/filter_search_part_master_api',
			type: 'GET',
			data: {
				search_part_no:partNumber,
				search_part_description: partDescription
			},
			success: function (data) {
				filteredData = data; // Store the filtered data
				renderData(filteredData); // Render the filtered data
			},
			error: function (xhr, error) {
				if (xhr.status === 401) {
					alert(xhr.responseJSON.message);
					window.location.href = '/login.html'
					localStorage.removeItem('accessToken');
				} else if (xhr.status >= 400 && xhr.status < 600) {
					alert(xhr.responseJSON.message);
				} else {
					console.error(error);
					alert('An error occurred while retrieving the data.');
				}
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
		// console.log('Button a.edit clicked, id:', addCurrentId);
	});



	// handing PATCH request

	var addCurrentId;

	$(document).on('click', 'a.edit', function() {
		// Get the data-id of the parent row of the clicked button
		addCurrentId = $(this).parents('tr').data('id');
	});
	
	$('.edit-form').on('submit', function(event) {
		event.preventDefault();
	
		var editPartNumber = $('#edit-part-number').val();
		var editPartDescription = $('#edit-part-description').val();
	
		$.ajax({
			url: 'http://' + window.location.hostname + ':4000/api/update_part_api',
			type: 'PATCH',
			data: JSON.stringify({
				id: addCurrentId,
				part_no: editPartNumber,
				part_description: editPartDescription,
				user_id: localStorage.getItem('userId')
			}),
			contentType: 'application/json',
            beforeSend: function(xhr) { 
                xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken'))
            },	
			
			success: function(response) {
				// handle successful response
				console.log(response);
	
				// Close the edit dialog box
				$('#editPartModal').modal('hide');
	
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
			error: function (xhr, error) {
				if (xhr.status === 401) {
					alert(xhr.responseJSON.message);
					window.location.href = '/login.html'
					localStorage.removeItem('accessToken');
				} else if (xhr.status >= 400 && xhr.status < 600) {
					alert(xhr.responseJSON.message);
				} else {
					console.error(error);
					alert('An error occurred while retrieving the data.');
				}
			}
		});
		// console.log('Button a.edit clicked, id:', addCurrentId);
	});
	



	// handing POST request
	

	$('.submit-form').on('submit', function(event) {
		event.preventDefault();

		var addPartNumber = $('#add-part-number').val();
		var addPartDescription = $('#add-part-description').val();

		// Get the data-id attribute of the row associated with the clicked button

		// var currentId = $(this).data('id');


		$.ajax({
			url: 'http://' + window.location.hostname + ':4000/api/post_part_api',
			type: 'POST',
			data: JSON.stringify({
				part_no: addPartNumber,
				part_description: addPartDescription,
				user_id: localStorage.getItem('userId')
			}),
			contentType: 'application/json',
            beforeSend: function(xhr) { 
                xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
            },	
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
				if (xhr.status === 401) {
                    alert(xhr.responseJSON.message);
					window.location.href = '/login.html'
					localStorage.removeItem('accessToken');
                } else if (xhr.status === 400) {
					alert(xhr.responseJSON.message);
					$('#add-part-number').val('');
					$('#add-part-description').val('');
				} else if (xhr.status >= 400 && xhr.status < 600) {
					alert(xhr.responseJSON.message);
				} else {
                    console.error(error);
                    alert('An error occurred while submitting the result.');
                }
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
			url: 'http://' + window.location.hostname + ':4000/api/delete_part_api',
			type: 'DELETE',
			data: JSON.stringify({
				id: deleteCurrentId,
				user_id: localStorage.getItem('userId')
			}),
			contentType: 'application/json',
            beforeSend: function(xhr) { 
                xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
            },	
			success: function(response) {
				// handle successful response
				console.log(response);

				// Close the edit dialog box
				$('#batchDeletePartModal').modal('hide');

				// Store the state of the "select all" checkbox
				localStorage.setItem('selectAllState', 'unchecked');

				// Refresh the page
				location.reload();

			},
			error: function(xhr, status, error) {
				if (xhr.status === 401) {
					alert(xhr.responseJSON.message);
					window.location.href = '/login.html'
					localStorage.removeItem('accessToken');
				} else if (xhr.status >= 400 && xhr.status < 600) {
					alert(xhr.responseJSON.message);
				} 
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
			url: 'http://' + window.location.hostname + ':4000/api/delete_part_api',
			type: 'DELETE',
			data: JSON.stringify({ 
				ids: idsToDelete, 
				user_id: localStorage.getItem('userId') }),

			contentType: 'application/json',
			beforeSend: function(xhr) { 
				xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
			},	
			success: function(response) {
				// Handle successful deletion here
				console.log(response);
						// Refresh the page
				location.reload();
			},
			error: function(xhr, status, error) {
				if (xhr.status === 401) {
					alert(xhr.responseJSON.message);
					window.location.href = '/login.html'
					localStorage.removeItem('accessToken');
				} else if (xhr.status >= 400 && xhr.status < 600) {
					alert(xhr.responseJSON.message);
				} else {
					console.error(error);
					alert('An error occurred while retrieving the data.');
				}
			}
		});
	});



//handling auto-complete for Part Number/Description

// auto-complete for Part Number, populate Part Description

	$(function () {
		var getData = function (request, response) {
			$.getJSON(
				"http://" + window.location.hostname + ":4000/api/auto_complete_filter_part_no_api",
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
				"http://" + window.location.hostname + ":4000/api/auto_complete_filter_part_name_for_part_no_api",
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
				"http://" + window.location.hostname + ":4000/api/auto_complete_filter_part_name_api",
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
				"http://" + window.location.hostname + ":4000/api/auto_complete_filter_part_no_for_part_name_api",
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
			url: 'http://' + window.location.hostname + ':4000/api/pagination_part_entries_api',
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


	//logout function, clear all access token upon log out
	$('#logout').click(function(){
		localStorage.clear();
    });
	
});


