
$('table').on('click', '.edit', function () {
  var row = $(this).closest('tr');
  var id = row.data('id');
  var partNumber = row.find('td:eq(1)').text();
  var partDescription = row.find('td:eq(2)').text();

  $('#edit-part-number').val(partNumber);
  $('#edit-part-description').val(partDescription);

  $('#submit-data').off('click').on('click', function () {
    var updatedPartNumber = $('#edit-part-number').val();
    var updatedPartDescription = $('#edit-part-description').val();

    var requestData = {
    id: id,
    part_number: updatedPartNumber,
    part_description: updatedPartDescription
    };

    $.ajax({
    url: 'http://localhost:5000/api/update_data_api', // Replace with the actual API endpoint
    type: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify(requestData),
    success: function (response) {
      // Update the row in the table
      row.find('td:eq(1)').text(updatedPartNumber);
      row.find('td:eq(2)').text(updatedPartDescription);
      // Close the modal
      $('#editPartModal').modal('hide');
      console.log('Update successful:', response); // Print the response
    },
    error: function (error) {
      console.error('Error updating data:', error);
    },
    });
  });
  });
