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
  

var row = `<tr data-id="${part.id}" class="part-row">
		<td>
		  <span class="custom-checkbox">
			<input type="checkbox"  id="checkbox-${part.id}" >
			<label for="checkbox-${part.id}"></label>
		  </span>
		</td>
		<td>${part.part_no}</td>
		<td>${part.part_description}</td>
		<td>${part.modified_date}</td>
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
 

	// Handle click event for edit button
	$(document).on('click', '.edit', function() {
		// Get the row associated with the clicked button
		var row = $(this).closest('tr');

		// Get the data-id attribute of the row
		var currentId = row.data('id');

		// Get the part number and part description from the row
		var partNumber = row.find('td').eq(1).text();
		var partDescription = row.find('td').eq(2).text();

		// Set the value of the part number and part description fields in the edit dialog
		$('#edit-part-number').val(partNumber);
		$('#edit-part-description').val(partDescription);

		// Set the data-id attribute of the submit button to the current id
		$('#submit-data').data('id', currentId);
	});



	// handing PATCH request

	$('#submit-data').on('click', function(event) {
		event.preventDefault();

		var partNumber = $('#edit-part-number').val();
		var partDescription = $('#edit-part-description').val();

		// Get the data-id attribute of the row associated with the clicked button

		var currentId = $(this).data('id');


		$.ajax({
			url: 'http://localhost:5000/api/update_data_api',
			type: 'PATCH',
			data: JSON.stringify({
				id: currentId,
				part_no: partNumber,
				part_description: partDescription
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

	// handing PATCH request

	// $('#submit-data').on('click', function(event) {
	// 	event.preventDefault();

	// 	var partNumber = $('#edit-part-number').val();
	// 	var partDescription = $('#edit-part-description').val();

	// 	// Get the data-id attribute of the row associated with the clicked button

	// 	var currentId = $(this).data('id');


	// 	$.ajax({
	// 		url: 'http://localhost:5000/api/update_data_api',
	// 		type: 'PATCH',
	// 		data: JSON.stringify({
	// 			id: currentId,
	// 			part_no: partNumber,
	// 			part_description: partDescription
	// 		}),
	// 		contentType: 'application/json',
	// 		success: function(response) {
	// 			// handle successful response
	// 			console.log(response);

	// 			// Close the edit dialog box
	// 			$('#editPartModal').modal('hide');

	// 			// Refresh the page
	// 			location.reload();
	// 		},
	// 		error: function(xhr, status, error) {
	// 			// handle error response
	// 			console.error(error);
	// 		}
	// 	});
	// });



});
  
  