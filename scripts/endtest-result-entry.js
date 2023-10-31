$(document).ready(function () {
  $('#file-import').on('change', function () {
    // Get the selected file
    var file = this.files[0];
  
    // Create a FormData object and append the file to it
    var formData = new FormData();
    formData.append('file', file);
  
    // Perform the AJAX POST request
    $.ajax({
      url: 'http://192.168.100.121:4000/api/endtest_upload_file_api', // Replace with your backend API endpoint
      type: 'POST',
      data: formData,
      contentType: false, // Set content type to false, as FormData handles it
      processData: false, // Set processData to false to prevent jQuery from transforming the data
      success: function (response) {
        // Handle the successful response here
        console.log(response);
        alert('File uploaded successfully.');
      },
      error: function (xhr, status, error) {
        // Handle error responses here
        console.error(error);
        alert('An error occurred while uploading the file.');
      }
    });
  });
  

}); 
