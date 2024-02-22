// -----initialization stateelement of page and rules---------
$('.laser-result-entry-sub-card').hide();
$('.laser-result-entry-sub-card-2').hide();
$('.export-laser-result-entry-sub-card').hide();
$('#input-result').text('');
$('#defect-code-field').attr('defect-id', '');
$('#defect-code-field').prop('disabled', true);



$(document).ready(function (){
    $('.displayed-username').text(localStorage.getItem('userName'));
    $('#select-button').click(function(event) {
    // Prevent the default behavior of the anchor element
    event.preventDefault();

    // Check if the input with id 'pdesc' is empty
    if ($('#pdesc').val() === '') {
        // Display an alert if it's empty
        alert('Error. Part No. is invalid or empty, please try again.');
    } else {
        // Perform your desired action if pdesc is not empty
        // For example, you can submit a form or trigger another function.
    }
    });

// select button logic    

// Define variables for text and color changes
var originalText = 'Select';
var selectedText = 'Selected';
// var emptyColor = '#4e4e4e'; // Color when #pdesc is empty
var notEmptyColor = '#3F8ABF'; // Color when #pdesc has a value
var selectedColor = '#28a745'; // Color when selected

// Initialize the selected state as false
var isSelected = false;

// Function to update the button color based on #pdesc value
function updateButtonColor() {
    var pdescIsEmpty = $('#pdesc').val().trim() === '';

    if (pdescIsEmpty) {
        $('#select-button').css('background-color', notEmptyColor);
    } else if (isSelected) {
        $('#select-button').css('background-color', selectedColor);
    } else {
        $('#select-button').css('background-color', notEmptyColor);
    }
}

// Initial button color setup
updateButtonColor();
// Attach the function to the window object so it can be accessed globally
window.updateButtonColor = updateButtonColor;


// Bind an input event handler to #pdesc to update the button color immediately
$('#pdesc').on('input', function() {
    updateButtonColor(); // Call the function to update the button color
});

// Click event handler for the button
$('#select-button').click(function () {
    // Clear input fields inside the div with class "laser-result-entry-sub-card"
    $('.laser-result-entry-sub-card input[type="text"]').val('');
    // Clear all checkboxes inside the div with class "check-boxes-fail-group"
    $('.check-boxes-fail-group input[type="checkbox"]').prop('checked', false);
    $('.export-laser-result-entry-sub-card').hide();
    $('#export-button').text(exportOriginalText);
    $('#export-button').css('background-color', originalColor);
    $('#save-button').show();


    // Check if #pdesc is empty
    var pdescIsEmpty = $('#pdesc').val().trim() === '';

    // Toggle the selected state only if #pdesc is not empty
    if (!pdescIsEmpty) {
        // Toggle the selected state
        isSelected = !isSelected;

        // Change text based on the selected state
        if (isSelected) {
            // When selected
            $(this).text(selectedText);
            $('#select-button').css('background-color', selectedColor);

        } else {
            // When not selected
            $(this).text(originalText);
            updateButtonColor(); // Update the button color when not selected
        }

        // Enable or disable the input field based on the selected state
        $('#pname').prop('readonly', isSelected);

        // Toggle the visibility of the elements with class laser-result-entry-sub-card
        $('.laser-result-entry-sub-card').toggle(isSelected);
        $('.laser-result-entry-sub-card-2').toggle(isSelected);
        
    }
});


// fail/pass button function

var inputResult = $('#input-result');

var isPassButtonPress = 0; // Initialize the variable

// Click event handler for the "PASS" button
$('#pass-button').click(function (e) {
    e.preventDefault();
    // Set the result text and color
    inputResult.text('PASS');
    inputResult.css('color', '#00ff2a');
    $('#defect-code-field').val('');
    $('#defect-desc').val('');
    $('#defect-code-field').attr('defect-id', '');
    $('#defect-code-field').prop('disabled', true);
    localStorage.removeItem('defectId');
    
    // Set isPassButtonPress to 1 when PASS button is clicked
    isPassButtonPress = 1;
});

// Click event handler for the "FAIL" button
$('#fail-button').click(function (e) {
    e.preventDefault();
    inputResult.text('');
   
    $('#defect-code-field').prop('disabled', false);

    // Check if isPassButtonPress is 1, if so, reset it to 0 and return without showing the alert
    if (isPassButtonPress === 1) {
        isPassButtonPress = 0;
        return;
    }

    if ($('#defect-desc').val() === '') {
        // Display an alert if it's empty
        alert('Error. Defect No. is invalid or empty, please try again.');
        inputResult.text('');
    } else {
      inputResult.text('FAIL');
      inputResult.css('color', '#ff0000');
    }
});

// ---handing POST request---

// Initialize partId and result variables
var partId = localStorage.getItem('partId') || '';
var result = '';

// Handling the button clicks
$('#select-button').click(function () {
    partId = $('#pname').attr('part-id');
// Store the partId in localStorage
    localStorage.setItem('partId', partId);
});

$('#pass-button').click(function () {
    result = $('#input-result').text();
    
});

$('#fail-button').click(function () {
    result = $('#input-result').text();
});
// Update the partId during page load if it's stored in localStorage 
// (so that the part-id attribute wil contain part-id GUID value after page refresh)
var storedPartId = localStorage.getItem('partId');
if (storedPartId) {
    $('#pname').attr('part-id', storedPartId);
}

    
// result value assignment and checking
var serialNumber=$('#serial-no-field').val();
// Add an event listener to the input field to update serialPartNumber on input changes
$('#serial-no-field').on('input', function () {
  serialNumber = $('#serial-no-field').val();
});
$('#serial-no-field').on('keydown', function(event) {
    if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
        event.preventDefault(); // Prevent the default behavior of the Enter key
        $('#data-matrix-field').focus();
    }
    $("#serial-no-field").on("blur", function() {
      var inputValue = $(this).val();
      var errorMessage = $("#error-message");
  
      if (inputValue.trim() === "") {
          // Only display the alert if the field is empty
          errorMessage.text("");
      } else if (!/^\d+$/.test(inputValue)) {
          alert("Please enter a numeric value.");
          $(this).val("");
          $(this).focus();
      } else {
          errorMessage.text("");
      }
  });
});



var dataMatrix = $('#data-matrix-field').val();
$('#data-matrix-field').on('input', function () {
  dataMatrix = $(this).val() 
});

$('#data-matrix-field').on('keydown', function(event) {
  if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
      event.preventDefault(); // Prevent the default behavior of the Enter key
      $('#label-id-field').focus(); // Move focus to the next field,
  }
  $("#data-matrix-field").on("blur", function() {
      var inputValue = $(this).val();
      var errorMessage = $("#error-message");

      if (inputValue.trim() === "") {
          // Only display the alert if the field is empty
          errorMessage.text("");
      } else if (!/^\d+(\.\d+)?$/.test(inputValue)) {
          alert("Please enter a numeric or float value.");
          $(this).val("");
          $(this).focus();
      } else {
          errorMessage.text("");
      }
  });
});


var labelId = $('#label-id-field').val();
    $('#label-id-field').on('input', function () {
    labelId = $(this).val();
    });
    $('#label-id-field').on('keydown', function(event) {
    if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
        event.preventDefault(); // Prevent the default behavior of the Enter key
        $('#defect-code-field').focus(); // Move focus to the next field,
    }
    $("#label-id-field").on("blur", function() {
        var inputValue = $(this).val();
        var errorMessage = $("#error-message");

      if (inputValue.trim() === "") {
          // Only display the alert if the field is empty
          errorMessage.text("");
      } else if (!/^\d+(\.\d+)?$/.test(inputValue)) {
          alert("Please enter a numeric or float value.");
          $(this).val("");
          $(this).focus();
      } else {
          errorMessage.text("");
      }
  });
});



  // Initialize defectId and result variables
  var defectId = $('#defect-code-field').attr('defect-id')
  // var defectId = localStorage.getItem('defectId') || '';



  // // Handling the button clicks
  // $('#fail-button').click(function () {
  //   defectId = $('#defect-code-field').attr('defect-id');
  // // Store the defectId in localStorage
  //     localStorage.setItem('defectId', defectId);
  // });

 
  // // (so that the defect-id attribute will contain defectId GUID value after page refresh)
  // var storedDefectId = localStorage.getItem('defectId');
  // if (storedDefectId) {
  //   $('#defect-code-field').attr('defect-id', storedDefectId);
  // }





    $('#save-form').on('submit', function(event) {
    event.preventDefault();
    $.ajax({
        url: 'http://' + window.location.hostname + ':4000/api/laser-result-entry-api',
        type: 'POST',
        data: JSON.stringify({
            part_id: partId,
            defect_id: $('#defect-code-field').attr('defect-id'),
            serial_no: serialNumber,
            result: result,
            data_matrix: dataMatrix,
            label_id:labelId,
            user_id: localStorage.getItem('userId')
        }),
        contentType: 'application/json',
        success: function(response) {
            // handle successful response
            console.log(response);

            $('#input-result').text('');
            // Reset other variables
            result = ''; // Reset result
            $('#serial-no-field').val('')
            $('#data-matrix-field').val('')
            $('#label-id-field').val('')
            $('#defect-code-field').val('')
            $('#defect-code-field').attr('defect-id', '');
            defectId='';
            $('#defect-desc').val('')
            localStorage.removeItem('defectId');
            alert('Result submitted successfully.');
        },
        error: function(xhr, status, error) {
            // handle error response
            if (xhr.status === 400) {
                // The response status is 400, indicating a duplicate
                alert(xhr.responseJSON.message);
                $('#input-result').text('');
                // Reset other variables
                result = ''; // Reset result
                $('#serial-no-field').val('')
                $('#data-matrix-field').val('')
                $('#label-id-field').val('')
                $('#defect-code-field').val('')
                $('#defect-code-field').attr('defect-id', '');
                defectId='';
                $('#defect-desc').val('')
                localStorage.removeItem('defectId');
            } else {
                console.error(error);
                alert('An error occurred while submitting the result.');
                $('#input-result').text('');
                // Reset other variables
                result = ''; // Reset result
                $('#serial-no-field').val('')
                $('#data-matrix-field').val('')
                $('#label-id-field').val('')
                $('#defect-code-field').val('')
                $('#defect-code-field').attr('defect-id', '');
                defectId='';
                $('#defect-desc').val('')
                localStorage.removeItem('defectId');
            }
        }
            });
        });

    // Trigger the form submission when the anchor is clicked
    $('#save-button').click(function() {
        // Get the values of serial number and result
        var serialNumber = $('#serial-no-field').val();
        var dataMatrix = $('#data-matrix-field').val();
        var labelId = $('#label-id-field').val();
        var result = $('#input-result').text();


        // Check if serial number is empty
        if (serialNumber.trim() === '') {
            alert('Serial number cannot be empty.');
            return; // Prevent further processing if serial number is empty
        }

        // Check if dataMatrix is empty
        if (dataMatrix.trim() === '') {
            alert('Data Matrix cannot be empty.');
            return; // Prevent further processing if result is empty
        }

        // Check if labelId is empty
        if (labelId.trim() === '') {
            alert('Label ID cannot be empty.');
            return; // Prevent further processing if result is empty
        }


        // Check if result is empty
        if (result.trim() === '') {
        alert('Result cannot be empty.');
        return; // Prevent further processing if result is empty
        }

        // Check if result is "FAIL" and defectId is empty
        if (result.trim() === 'FAIL' && $('#defect-code-field').attr('defect-id').trim() === '') {
        alert('Result is "FAIL," but defectCode cannot be empty.');
        return; // Prevent further processing if result is "FAIL" and defectId is empty
        }

        // If all checks pass, proceed with the form submission
        $('#save-form').submit();

        });


    //Laser Export Section
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
    // Define variables buttonfor text and color changes
    var exportOriginalText = 'Export';
    var cancelText = 'Back';
    // var emptyColor = '#4e4e4e'; // Color when #pdesc is empty
    var originalColor = '#5FCF80'; // Color when #pdesc has a value
    var cancelColor = '#bf3f3f'; // Color when selected

    // Initialize the selected state as false
    var isSelected = false;


    // Click event handler for the button
    $('#export-button').click(function () {
        // Clear input fields inside the div with class "export-laser-result-entry-sub-card"
        $('.export-laser-result-entry-sub-card input[type="text"]').val('');

        // Toggle the selected state
        isSelected = !isSelected;

        // Change text and background color based on the selected state
        if (isSelected) {
            // When selected
            $('#export-button').text(cancelText);
            $('#export-button').css('background-color', cancelColor);
            $('.laser-result-entry-sub-card').hide();
            $('.laser-result-entry-sub-card input[type="text"]').val('');
            $('#input-result').text('');
            $('#save-button').hide();
        } else {
            // When not selected
            $('#export-button').text(exportOriginalText);
            $('#export-button').css('background-color', originalColor);
            $('.laser-result-entry-sub-card').show();
            $('#save-button').show();
            
        }

        // Toggle the visibility of the elements with class export-laser-result-entry-sub-card
        $('.export-laser-result-entry-sub-card').toggle(isSelected);

    });
    //POST data parameter for data export

    $('#export-data-button').click(function(event){
        event.preventDefault();
    
        var dateFrom = $('#date-from-field').val();
        var dateTo = $('#date-to-field').val();
    
        fetch('http://' + window.location.hostname + ':4000/api/laser_result_entry_api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                part_id: partId,
                date_from: dateFrom,
                date_to: dateTo

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
            a.download = 'laser_result.xlsx';
            document.body.appendChild(a);
    
            // Trigger the download
            a.click();
    
            // Clean up
            window.URL.revokeObjectURL(blobUrl);
    
            // Clear input fields
            $('#date-from-field').val('');
            $('#date-to-field').val('');
        })
        .catch(error => console.error(error));
    });
    





});
