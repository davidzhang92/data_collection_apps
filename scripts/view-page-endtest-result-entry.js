$(document).ready(function () {

	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip();
	$('.displayed-username').text(localStorage.getItem('userName'));
	// datepicker function for date to and date from
	$(function() {
		$("#date-from-field").datepicker({
			dateFormat: "yy-mm-dd"
		});

		$("#date-to-field").datepicker({
			dateFormat: "yy-mm-dd"
		});

		// Add an event listener to the "date-to-field" input
		$("#date-to-field").on("change", function() {
			// Get the selected dates from both fields
			var fromDate = $("#date-from-field").datepicker("getDate");
			var toDate = $("#date-to-field").datepicker("getDate");

			// Check if toDate is smaller (earlier) than fromDate
			if (toDate && fromDate){
				if (toDate < fromDate) {
					// Show an alert message
					$("#date-to-field").val('')
					alert("The end date cannot be earlier than the start date.");
					// You can also reset the "date-to-field" value or take other actions as needed
				}
			}
				
		});
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

    data.forEach(function (result) {
        // Parse the date string
        var createDate = new Date(result.created_date);

        // Format the date as 'YYYY-MM-DD HH:MM:SS'
        var formattedDate = createDate.toISOString().slice(0, 16).replace('T', ' ');

        // Replace 'null' with '-'
        var partNumber = result.part_no !== null ? result.part_no : '-';
		var userName = result.username !== null ? result.username : '-';

        var row = `<tr data-id="${result.id}">
            <td>
                <span class="custom-checkbox">
                    <input type="checkbox" class="row-checkbox" id="${result.id}">
                    <label for="${result.id}"></label>
                </span>
            </td>
            <td>${partNumber}</td>
            <td>${result.serial_no}</td>
            <td>${result.data_matrix}</td>
			<td>${userName}</td>
            <td id='created-date'>${formattedDate}</td>

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
				'http://' + window.location.hostname + ':4000/api/endtest_result_entry_view_api';
		
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
				error: function (error) {
					console.error('Error fetching data:', error);
				},
			});
		}

		// Fetch data on page load if both search fields are empty
		const initialPartNumber = $('#part-number-field').val().trim();

		if (!initialPartNumber) {
			fetchData(); // Moved the initial fetch here
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
			const dateFrom = $('#date-from-field').val().trim();
			const dateTo = $('#date-to-field').val().trim();

			// Create an empty object to store the data to send in the request
			const requestData = {};

			if (partNumber || dateFrom || dateTo) {
				// Hide the pagination container
				$('#page_container').hide();
				if (partNumber) {
					requestData.search_part_no = partNumber;
				}
				if (dateFrom) {
					requestData.search_date_from = dateFrom;
				}
				if (dateTo) {
					requestData.search_date_to = dateTo;
				}
				resetCurrentPage(); // Reset the current page to 1
			} else {
				// If all search fields are empty, reset filtering and show the pagination container
				filteredData = [];
				resetCurrentPage(); // Reset the current page to 1
				fetchData(); // Fetch all data
				$('#page_container').show(); // Show the pagination container
			}


			
			if (partNumber || dateFrom || dateTo) {
				// First AJAX request to filter data
				$.ajax({
					url: 'http://' + window.location.hostname + ':4000/api/filter_search_endtest_result_entry_view_api',
					type: 'GET',
					data: requestData,
					beforeSend: function(xhr) { 
						xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken'))
					},
					 // Send the requestData object
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
				// If all search fields are empty, reset filtering and show pagination container
				filteredData = [];
				$('#page_container').show(); // Show the pagination container
			}
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
				url: 'http://' + window.location.hostname + ':4000/api/delete_endtest_result_entry_view_api',
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
			url: 'http://' + window.location.hostname + ':4000/api/delete_endtest_result_entry_view_api',
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
				// Store the state of the "select all" checkbox
				localStorage.setItem('selectAllState', 'unchecked');

						// Refresh the page
				location.reload();
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
	});


	// auto-complete for Part Number

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

		$("#part-number-field").autocomplete({
			source: getData,
			select: $("#part-number-field").val().trim(),
			minLength: 3
			});
		});





	// ==========================================================
	// ***pagination section***
	// ==========================================================
	let currentPage = 1;
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

	// Initial fetch of pagination entries count and creation of pagination
	fetchPaginationEntriesCount();

	// Function to fetch the total entries count from the API
	function fetchPaginationEntriesCount() {
		$.ajax({
			type: 'GET',
			url: 'http://' + window.location.hostname + ':4000/api/pagination_endtest_result_entry_count_api',
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

		   //Endtest Report Section
	// datepicker function for date to and date from
	$(function() {
		$("#date-from-field").datepicker({
			dateFormat: "yy-mm-dd"
		});

		$("#date-to-field").datepicker({
			dateFormat: "yy-mm-dd"
		});

		// Add an event listener to the "date-to-field" input
		$("#date-to-field").on("change", function() {
			// Get the selected dates from both fields
			var fromDate = $("#date-from-field").datepicker("getDate");
			var toDate = $("#date-to-field").datepicker("getDate");

			// Check if toDate is smaller (earlier) than fromDate
			if (toDate < fromDate) {
				// Show an alert message
				$("#date-to-field").val('')
				alert("The end date cannot be earlier than the start date.");
				// You can also reset the "date-to-field" value or take other actions as needed
			}
		});
	});


    //POST data parameter for data export

    $('#download').click(function(event){
        event.preventDefault();
    
        var dateFrom = $('#date-from-field').val();
        var dateTo = $('#date-to-field').val();
		var partNumber = $('#part-number-field').val().trim()
    
        fetch('http://' + window.location.hostname + ':4000/api/endtest_result_report_api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': localStorage.getItem('accessToken'),
            },	
            body: JSON.stringify({
                date_from: dateFrom,
                date_to: dateTo,
                part_no: partNumber,
				user_id: localStorage.getItem('userId')
            })
        })
        .then(response => response.blob())
        .then(blob => {
            // Create a blob URL from the response
            var blobUrl = window.URL.createObjectURL(blob);
    
            // Create an anchor element to trigger the download
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = 'endtest_report.xlsx';
            document.body.appendChild(a);
    
            // Trigger the download
            a.click();
    
            // Clean up
            window.URL.revokeObjectURL(blobUrl);
    
            // Clear input fields
            // $('#date-from-field').val('');
            // $('#date-to-field').val('');
        })
        .catch(error => console.error(error));
    });

});