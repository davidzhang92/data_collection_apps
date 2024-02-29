$(document).ready(function () {
  $('.displayed-username').text(localStorage.getItem('userName'));
  $('#file-import').on('change', function () {
    // Get the selected file
    var file = this.files[0];
  
    // Create a FormData object and append the file to it
    var formData = new FormData();
    formData.append('file', file);
  
    // Perform the AJAX POST request
    $.ajax({
      url: 'http://' + window.location.hostname + ':4000/api/endtest_upload_file_api', // Replace with your backend API endpoint
      type: 'POST',
      data: formData,
      contentType: false,
			beforeSend: function(xhr) { 
				xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
			},	 // Set content type to false, as FormData handles it
      processData: false, // Set processData to false to prevent jQuery from transforming the data
      success: function (response) {
        // Handle the successful response here
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
  
  	//logout function, clear all access token upon log out
	$('#logout').click(function(){
		localStorage.clear();
    });

}); 
