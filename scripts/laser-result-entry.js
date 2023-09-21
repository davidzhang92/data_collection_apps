// -----initialization stateelement of page and rules---------
// $('.laser-result-entry-sub-card').hide();
// $('.laser-result-entry-sub-card-2').hide();

$(document).ready(function (){

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
    
      var dataMatrix=$('#data-matrix-field').val();
      // Add an event listener to the input field to update serialPartNumber on input changes
      $('#data-matrix-field').on('input', function () {
        dataMatrix = $('#data-matrix-field').val();
      });
      $('#data-matrix-field').on('keydown', function(event) {
          if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
              event.preventDefault(); // Prevent the default behavior of the Enter key
              $('#label-id-field').focus();
          }
          $("#data-matrix-field").on("blur", function() {
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
      
      var labelId=$('#label-id-field').val();
      // Add an event listener to the input field to update serialPartNumber on input changes
      $('#label-id-field').on('input', function () {
        labelId = $('#label-id-field').val();
      });
      $('#label-id-field').on('keydown', function(event) {
          if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
              event.preventDefault(); // Prevent the default behavior of the Enter key
          }
          $("#label-id-field").on("blur", function() {
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

});  