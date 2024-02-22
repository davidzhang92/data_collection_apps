// -----initialization state of page and rules---------
$('.leaktest-result-entry-sub-card').hide();
$('.leaktest-result-entry-sub-card-2').hide();

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
        // Clear input fields inside the div with class "leaktest-result-entry-sub-card"
        $('.leaktest-result-entry-sub-card input[type="text"]').val('');
        // Clear all checkboxes inside the div with class "check-boxes-fail-group"
        $('.check-boxes-fail-group input[type="checkbox"]').prop('checked', false);

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

            // Toggle the visibility of the elements with class leaktest-result-entry-sub-card
            $('.leaktest-result-entry-sub-card').toggle(isSelected);
            $('.leaktest-result-entry-sub-card-2').toggle(isSelected);
        }
    });


  // fail/pass button function

    var inputResult = $('#input-result');

  // Click event handler for the "PASS" button
  $('#pass-button').click(function (e) {
      e.preventDefault();
        // Set the result text and color
        inputResult.text('PASS');
        inputResult.css('color', '#00ff2a');
  });

  // Click event handler for the "FAIL" button
  $('#fail-button').click(function (e) {
      e.preventDefault();
      // Set the result text and color
      inputResult.text('FAIL');
      inputResult.css('color', '#ff0000');
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
    var housingPartNumber=$('#housing-no-field').val();
    // Add an event listener to the input field to update serialPartNumber on input changes
    $('#housing-no-field').on('input', function () {
      housingPartNumber = $('#housing-no-field').val();
    });
    $('#housing-no-field').on('keydown', function(event) {
        if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
            event.preventDefault(); // Prevent the default behavior of the Enter key
            $('#fine-field').focus();
        }
        $("#housing-no-field").on("blur", function() {
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
    


    var fineValue = $('#fine-field').val() || '0.0000';
    $('#fine-field').on('input', function () {
      fineValue = $(this).val() || '0.0000';
    });

    $('#fine-field').on('keydown', function(event) {
      if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
          event.preventDefault(); // Prevent the default behavior of the Enter key
          $('#gross-field').focus(); // Move focus to the next field,
      }
      $("#fine-field").on("blur", function() {
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
  
  
    var grossValue = $('#gross-field').val() || '0.0000';
    $('#gross-field').on('input', function () {
      grossValue = $(this).val() || '0.0000';
    });
    $('#gross-field').on('keydown', function(event) {
      if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
          event.preventDefault(); // Prevent the default behavior of the Enter key
          $('#others-field').focus(); // Move focus to the next field,
      }
      $("#gross-field").on("blur", function() {
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

    var othersValue = $('#others-field').val() || '0.0000';
    $('#others-field').on('input', function () {
      othersValue = $(this).val() || '0.0000';
    });
    $('#others-field').on('keydown', function(event) {
      if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
          event.preventDefault(); // Prevent the default behavior of the Enter key
      }
      $("#others-field").on("blur", function() {
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

    $('#save-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: 'http://' + window.location.hostname + ':4000/api/leaktest-result-entry-api',
            type: 'POST',
            data: JSON.stringify({
                part_id: partId,
                housing_no: housingPartNumber,
                result: result,
                fine_value: fineValue,
                gross_value: grossValue,
                others_value: othersValue,
                user_id: localStorage.getItem('userId')
            }),
            contentType: 'application/json',
            success: function(response) {
                // handle successful response
                console.log(response);

                $('#input-result').text('');
                // Reset other variables
                result = ''; // Reset result
                $('#housing-no-field').val('')
                $('#fine-field').val('')
                $('#gross-field').val('')
                $('#others-field').val('')

                alert('Result submitted successfully.');
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

    // Trigger the form submission when the anchor is clicked
    $('#save-button').click(function() {
        // Get the values of serial number and result
        var housingPartNumber = $('#housing-no-field').val();
        var resultValue = $('#input-result').text();


        // Check if serial number is empty
        if (housingPartNumber.trim() === '') {
            alert('Serial number cannot be empty.');
            return; // Prevent further processing if serial number is empty
        }

        // Check if result is empty
        if (resultValue.trim() === '') {
            alert('Result cannot be empty.');
            return; // Prevent further processing if result is empty
        }



        // If all checks pass, proceed with the form submission
        $('#save-form').submit();
    });

});
