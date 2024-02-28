$(document).ready(function () {

    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();
	$('.displayed-username').text(localStorage.getItem('userName'));

	

	//clear all field in modal window when it's hidden
	$('#addUserModal').on('hidden.bs.modal', function () {
		// Clear the fields here
		$('#add-username').val('');
		$('#add-user-access-selection').val('');
		$('#add-password').val('');
		$('#add-confirm-password').val('');
		// Add more fields as needed
	});

	$('#changePasswordUserModal').on('hidden.bs.modal', function () {
		// Clear the fields here
		$('#edit-password').val('');
		$('#edit-confirm-password').val('');
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
	  
		data.forEach(function (user) {

			// Parse the date string
			var latestDate = new Date(user.latest_date);
			var lastLoginDate = new Date(user.last_login);

			// Format the date as 'YYYY-MM-DD HH:MM:SS'
			var formattedlatestDate = latestDate.toISOString().slice(0, 16).replace('T', ' ');
	  
			// Replace 'null' with '-'
			var formattedLastLogin;
			
			if (user.last_login !== null) {
				var lastLoginDate = new Date(user.last_login);
				formattedLastLogin = lastLoginDate.toISOString().slice(0, 16).replace('T', ' ');
			} else {
				formattedLastLogin = '-';
			}


			var createdBy = user.created_by_username !== null ? user.created_by_username : '-';

            var row = `<tr data-id="${user.id}">
                    <td>
                    <span class="custom-checkbox">
                        <input type="checkbox" class="row-checkbox" id="${user.id}">
                        <label for="${user.id}"></label>
                    </span>
                    </td>
                    <td>${user.username}</td>
                    <td>${user.access_type}</td>
                    <td>${formattedlatestDate}</td>
                    <td>${formattedLastLogin}</td>
					<td>${createdBy}</td>
                    <td>
                    <a href="#editUserModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
					<a href="#changePasswordUserModal" class="change-password" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Change Password">&#xE73c;</i></a>
                    <a href="#deleteUserModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                    </td>
                </tr>`;
            
                tableBody.append(row);
                });
    
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
	
	    }

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
            'http://' + window.location.hostname + ':4000/api/get_user_api';
    
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
				//disable checkbox state for own id

				var userId = localStorage.getItem('userId');
				$('tr[data-id="' + userId + '"]').each(function() {
					$(this).find('.row-checkbox').prop('disabled', true);
					$(this).find('.delete').hide();
				});
            },
            error: function(xhr, textStatus, error) {
				if (xhr.status === 401) {
					alert(xhr.responseJSON.message);
					window.location.href = '/login.html'
					localStorage.removeItem('accessToken');
				} else if (xhr.status  === 403) {
					alert(xhr.responseJSON.message);
					if(window.history.length > 1){
						window.history.back();
					} else {
						window.location.href = '/menus/dashboard/dashboard.html'; 
					}
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
    var initialUsername = $('#username-field').val().trim();
    var initialUserAccessLevel = $('#user-access-selection').val().trim();
    if (!initialUsername && !initialUserAccessLevel) {
        fetchData();
    }	

	// Function to reset the current page to 1
	function resetCurrentPage() {
		currentPage = 1;
		createPagination(currentPage);
		updatePaginationButtons(currentPage);
	}

	// Function to handle the search button click
	$('#search-user').click(function () {
		var username = $('#username-field').val().trim();
		var userAccessLevel = $('#user-access-selection').val().trim();
	
		if (username || userAccessLevel) {
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
	

		if (username || userAccessLevel) {
		// Fetch data using the filter API
		$.ajax({
			url: 'http://' + window.location.hostname + ':4000/api/filter_search_user_master_api',
			type: 'GET',
			data: {
				search_username:username,
				search_user_access_level: userAccessLevel
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
		console.log(addCurrentId);
		// Get the username and accesslevel from the row
		var editUsername = row.find('td').eq(1).text();
		var editUserAccessLevel = row.find('td').eq(2).text();

		// Set the value of the user number and user description fields in the edit dialog
		$('#edit-username').val(editUsername);
		$('#edit-user-access-selection').val(editUserAccessLevel);

		

		// Set the data-id attribute of the submit button to the current id
		$('#submit-data-edit').data('id', addCurrentId);
	});


	// Handle change event for user access level selection in add form

	$('#add-user-access-selection').on('change', function() {
		// Get the selected option element
		var selectedOption = $(this).find('option:selected');

		// Update the accessId variable
		accessId = selectedOption.attr('access-id');

		// Set the access-id attribute for the #edit-user-access-selection element
		$('#edit-user-access-selection').attr('data-access-id', accessId);
	});


	// handing PATCH request
	var addCurrentId;
	var accessId;

	$(document).on('click', 'a.edit', function() {
		// Get the data-id of the parent row of the clicked button
		addCurrentId = $(this).parents('tr').data('id');
	});
	
	$('.edit-form').on('submit', function(event) {
		event.preventDefault();
		// var editUsername = $('#edit-username').val();
		
		// Get the selected option element
		var selectedOption = $('#edit-user-access-selection').find('option:selected');
		
		// Get the access-id attribute from the selected option
		var editUserAccessLevel = selectedOption.attr('access-id');
		// var editPassword = $('edit-confirm-password').val()
	
		$.ajax({
			url: 'http://' + window.location.hostname + ':4000/api/update_user_api',
			type: 'PATCH',
			data: JSON.stringify({
				id: addCurrentId,
				access_level: editUserAccessLevel,
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
				$('#editUserModal').modal('hide');
	
				//update the row
				function updateTableRow(response) {
					// Find the table row with the corresponding data-id
					var rowToUpdate = $('table tbody').find(`tr[data-id="${response.id}"]`);
				
					// Update the row with the new data
					rowToUpdate.find('td').eq(1).text(response.username);
					rowToUpdate.find('td').eq(2).text(response.access_level);
					rowToUpdate.find('td').eq(3).text(response.modified_date);

					// Capture the value
					var originalValue = rowToUpdate.find('td').eq(3).text();

					// Parse the date string
					var latestDate = new Date(originalValue);

					// Format the date as 'YYYY-MM-DD HH:MM:SS'
					var formattedlatestDate = latestDate.toISOString().slice(0, 16).replace('T', ' ');

					// Replace the original value
					rowToUpdate.find('td').eq(3).text(formattedlatestDate);


				}
	
				updateTableRow(response);
			},
			error: function(xhr, textStatus, error) {
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
	
	// Handle edit and password PATCH request

		// Handle click event for edit button
		
		$(document).on('click', '.change-password', function() {
			// Get the row associated with the clicked button
			var row = $(this).closest('tr');

			// Get the data-id attribute of the row
			var addCurrentIdForPasswordEdit = row.data('id');

			// Set the data-id attribute of the submit button to the current id
			$('#submit-password-edit').data('id', addCurrentIdForPasswordEdit);
		});



		// handing PATCH request

		var addCurrentIdForPasswordEdit;

		$(document).on('click', 'a.change-password', function() {
			// Get the data-id of the parent row of the clicked button
			addCurrentIdForPasswordEdit = $(this).parents('tr').data('id');
		});
		
		$('.edit-password-form').on('submit', function(event) {
			event.preventDefault();
		
			var password = $('#edit-password').val();
			var confirmPassword = $('#edit-confirm-password').val();

			if (password === confirmPassword) {
				var validPassword = confirmPassword;
				
			}  else {
				alert('Error: Password doesn\'t match, try again.');
				password = $('#edit-password').val('');
				confirmPassword = $('#edit-confirm-password').val('');
				validPassword =''
				return;
			}

		
			$.ajax({
				url: 'http://' + window.location.hostname + ':4000/api/update_user_password_api',
				type: 'PATCH',
				data: JSON.stringify({
					id: addCurrentIdForPasswordEdit,
					password: validPassword,
				}),
				contentType: 'application/json',
				beforeSend: function(xhr) { 
					xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
				},
				success: function(response) {
					// handle successful response
					console.log(response);
					password = $('#edit-password').val('')
					confirmPassword = $('#edit-confirm-password').val('');
					validPassword =''
					alert('Password changed successfully.');

					// Close the edit dialog box
					$('#changePasswordUserModal').modal('hide');
				},
				error: function(xhr, textStatus, error) {
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


	// handing POST request



	var selectedUserAccessLevel =''
	$('#add-user-access-selection').change(function() {
		var selectedOption = $(this).find('option:selected');
		selectedUserAccessLevel = selectedOption.attr('access-id');
	});

	$('.add-user-submit-form').on('submit', function(event) {
		event.preventDefault();

		var addUserAccesLevel = selectedUserAccessLevel;
		var addUsername = $('#add-username').val();
		var password = $('#add-password').val();
		var confirmPassword = $('#add-confirm-password').val();
		var validPassword = ''

		// input validation

		 if (selectedUserAccessLevel === '') {
			alert('Select the Access Level first.');
			return;
		}

		if (password === confirmPassword) {
			validPassword = confirmPassword;
		}  else {
			alert('Error: Password doesn\'t match, try again.');
			password = $('#add-password').val('');
			confirmPassword = $('#add-confirm-password').val('');
			validPassword =''
			return;
		}

			$.ajax({
				url: 'http://' + window.location.hostname + ':4000/api/post_user_api',
				type: 'POST',
				data: JSON.stringify({
					username: addUsername,
					access_level: addUserAccesLevel,
					password: validPassword,
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
					$('#addUserModal').modal('hide');

					// Clear input fields
					$('#add-username').val('');
					$('#add-user-access-selection').val('');
					validPassword = ''
					$('#add-password').val('');
					$('#add-confirm-password').val('');


					// Refresh the page
					location.reload();
				},
				error: function(xhr, textStatus, error) {
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
			url: 'http://' + window.location.hostname + ':4000/api/delete_user_api',
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
				$('#batchDeleteUserModal').modal('hide');

				// Store the state of the "select all" checkbox
				localStorage.setItem('selectAllState', 'unchecked');

				// Refresh the page
				location.reload();

			},
			error: function(xhr, status, error) {
				// handle error response
				console.error(error);
				alert(xhr.responseJSON.message);
			}
		});
	});

	// Handle batch delete and DELETE request

	// Get all checked checkboxes
	var checkedCheckboxes = $('input.row-checkbox:checked:not(:disabled)');

	// Create an array to store the IDs of the rows to be deleted
	var idsToDelete = [];

	// Loop through each checked checkbox and add its ID to the array
	checkedCheckboxes.each(function() {
		idsToDelete.push($(this).attr('id'));
	});

	console.log(idsToDelete);

	// Send the AJAX request to delete the rows
	$('#submit-batch-data-delete').on('click', function(event) {
		event.preventDefault();
		// Get all checked checkboxes
		var checkedCheckboxes = $('input.row-checkbox:checked:not(:disabled)');

		// Create an array to store the IDs of the rows to be deleted
		var idsToDelete = [];

		// Loop through each checked checkbox and add its ID to the array
		checkedCheckboxes.each(function() {
			idsToDelete.push($(this).attr('id'));
		});

		console.log(idsToDelete);
		// Get the data-id attribute of the row associated with the clicked button
		$.ajax({
			url: 'http://' + window.location.hostname + ':4000/api/delete_user_api',
			type: 'DELETE',
			data: JSON.stringify({ 
					ids: idsToDelete,
					user_id: localStorage.getItem('userId')
				 }),
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
				// Handle error here
				console.error(error);
			// Refresh the page
			// location.reload();
			}
		});
	});

	
	//handling auto-complete for username

	$(function () {
		var getData = function (request, response) {
			$.getJSON(
				"http://" + window.location.hostname + ":4000/api/auto_complete_filter_user_name_api",
				// { term: request.term }, // Pass the term as a query parameter
				{ search_username: request.term }, // Pass the term as a query parameter
				function (data) {
					var items = []; // Array to store the autocomplete suggestions
					$.each(data, function (index, item) {
						items.push(item.username); // Extract the relevant field from the response
					});
					response(items);
				}
			);
		};


		var selectItem = function (event, ui) {
			$("#username-field").val(ui.item.value);
		};



		$("#username-field").autocomplete({
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
			url: 'http://' + window.location.hostname + ':4000/api/pagination_user_entries_api',
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


});