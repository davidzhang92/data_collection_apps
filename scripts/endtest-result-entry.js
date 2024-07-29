$(document).ready(function () {

  // set the zoom level based on resolution
  var screenWidth = window.innerWidth;
  var zoomLevel;

  if (screenWidth <= 1600) {
      zoomLevel = 0.8; 
  }
  $('body').css('zoom', zoomLevel);
  // Calculate the screen width
  var screenWidth = window.screen.width;
  // Calculate the desired zoom level based on the screen width
  var zoomLevel = screenWidth / 1920; // Adjust  according to your base resolution
  // Apply the zoom level to the body
  $('body').css('zoom', zoomLevel);

  $('.displayed-username').text(localStorage.getItem('userName'));


    // Perform the AJAX POST Upload mdb request
  $('#file-import').on('change', function () {
    // Get the selected file
    var file = this.files[0];
  
    // Create a FormData object and append the file to it
    var formData = new FormData();
    formData.append('file', file);
  
    $.ajax({
      url: 'http://' + window.location.hostname + ':4000/api/endtest_upload_file_api', 
      type: 'POST',
      data: formData,
      contentType: false,
			beforeSend: function(xhr) { 
				xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
			},	 // Set content type to false, as FormData handles it
      processData: false, // Set processData to false to prevent jQuery from transforming the data
      success: function (response) {
        console.log(response);
        alert('File uploaded successfully.');
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
  
  // AJAX POST for vi defect entry



  $('#save-form').on('submit', function(event) {
    event.preventDefault();

    $.ajax({
        url: 'http://' + window.location.hostname + ':4000/api/endtest_defect_result_entry_api',
        type: 'POST',
        data: JSON.stringify({
            part_id: $('#pname').attr('part-id'),
            defect_id: $('#defect-code-field').attr('defect-id') ,
            quantity: $('#qty-input-field').val(),
            user_id: localStorage.getItem('userId')
        }),
        contentType: 'application/json',
  beforeSend: function(xhr) { 
    xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
  },
        success: function(response) {
            // handle successful response
            console.log(response);

            $('#qty-input-field').val('');
            $('#pname').attr('part-id', '')
            $('#pname').val('')
            $('#pdesc').val('')
            $('#defect-code-field').val('');
            $('#defect-code-field').attr('defect-id', '');
            $('#defect-desc').val('')
            alert('Result submitted successfully.');
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

    // Trigger the form submission when the anchor is clicked
    $('#save-button').click(function() {

        // Get the values of serial number and result


        if ($('#pname').attr('part-id').trim() === '') {
          alert('Error: Part No. is invalid or empty, please try again.');
          return;
        }

        if ($('#defect-code-field').attr('defect-id').trim() === '') {
          alert('Error: Defect Code is invalid or empty, please try again.');
          return; 
          }

        if ($('#qty-input-field').val().trim() === '') {
          alert('Error: Quantity cannot be empty.');
          return; 
          }

        if ($('#qty-input-field').val().match(/^\d+$/) === null) {
        alert('Error: Quantity is invalid, please try again.'); 
        return;
          }
        
        if ($('#qty-input-field').val() < 1) {
          alert('Error: Quantity cannot be zero, please try again.'); 
          return;
            }


        // If all checks pass, proceed with the form submission
        $('#save-form').submit();

        });



  	//logout function, clear all access token upon log out
	$('#logout').click(function(){
		localStorage.clear();
    });

}); 
