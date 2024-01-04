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
	  
		data.forEach(function (user) {

			// Parse the date string
			var latestDate = new Date(user.latest_date);

			// Format the date as 'YYYY-MM-DD HH:MM:SS'
			var formattedlatestDate = latestDate.toISOString().slice(0, 16).replace('T', ' ');
	  
			// Replace 'null' with '-'
			var last_login = user.last_login !== null ? user.last_login : '-';

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
                    <td>${last_login}</td>
                    <td>
                    <a href="#editUserModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
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
    const initialUsername = $('#username-field').val().trim();
    const initialUserAccessLevel = $('#user-access-selection').val().trim();
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
	$('#search-part').click(function () {
		const username = $('#username-field').val().trim();
		const userAccessLevel = $('#user-access-selection').val().trim();
	
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
			url: 'http://' + window.location.hostname + ':4000/api/filter_search_xxx',
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
			$('#page_container').show(); // Show the pagination container
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
		var editUsername = row.find('td').eq(1).text();
		var editUserAccessLevel = row.find('td').eq(2).data('access-id');
		var editPassword = row.find('td').eq(4).text();

		// Set the value of the part number and part description fields in the edit dialog
		$('#edit-username').val(editUsername);
		$('#edit-user-access-selection').val(editUserAccessLevel);
		$('#edit-confirm-password').val(editPassword);
		

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
		var editUsername = $('#edit-username').val();
		
		// Get the selected option element
		var selectedOption = $('#edit-user-access-selection').find('option:selected');
		
		// Get the access-id attribute from the selected option
		var editUserAccessLevel = selectedOption.attr('access-id');
		var editPassword = $('edit-confirm-password').val()
	
		$.ajax({
			url: 'http://' + window.location.hostname + ':4000/api/update_user_api',
			type: 'PATCH',
			data: JSON.stringify({
				id: addCurrentId,
				username: editUsername,
				user_access_level: editUserAccessLevel,
				password: editPassword
			}),
			contentType: 'application/json',
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
					rowToUpdate.find('td').eq(1).text(response.username);
					rowToUpdate.find('td').eq(2).text(response.user_access_level);
					rowToUpdate.find('td').eq(3).text(response.latest_date);
					rowToUpdate.find('td').eq(3).text(response.last_login);
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

		var addUsername = $('#add-username').val();
        $('#add-user-access-selection').change(function() {
            var addUserAccessLevel = $(this).val();

		// Get the data-id attribute of the row associated with the clicked button

		// var currentId = $(this).data('id');


		$.ajax({
			url: 'http://' + window.location.hostname + ':4000/api/post_user_api',
			type: 'POST',
			data: JSON.stringify({
				username: addUsername,
				user_access_level: addUserAccessLevel
			}),
			contentType: 'application/json',
			success: function(response) {
				// handle successful response
				console.log(response);

				// Close the edit dialog box
				$('#addPartModal').modal('hide');

				 // Clear input fields
				 $('#add-username').val('');
				 $('#add-user-access-selection').val('');

				// Refresh the page
				// location.reload();
			},
			error: function(xhr, status, error) {
				// handle error response
				if (xhr.status === 400) {
                    // The response status is 400, indicating a duplicate
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
			url: 'http://' + window.location.hostname + ':4000/api/delete_user_api',
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
                url: 'http://' + window.location.hostname + ':4000/api/delete_user_api',
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
                // location.reload();
                }
            });
        });

    });

});