// initialization state of page 
$('.programming-result-entry-sub-card').hide();
$('.programming-result-entry-sub-card-2').hide();

$(document).ready(function (){

    $('#select-button').click(function(event) {
        // Prevent the default behavior of the anchor element
        event.preventDefault();
    
        // Check if the input with id 'pdesc' is empty
        if ($('#pdesc').val() === '') {
          // Display an alert if it's empty
          alert('Part Number is invalid or empty, please try.');
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

            // Toggle the visibility of the elements with class programming-result-entry-sub-card
            $('.programming-result-entry-sub-card').toggle(isSelected);
            $('.programming-result-entry-sub-card-2').toggle(isSelected);
        }
    });


// fail/pass button function

  var passButton = $('#pass-button');
  var failButton = $('#fail-button');
  var inputResult = $('#input-result');

  passButton.click(function(e) {
    e.preventDefault();
    inputResult.text('PASS');
    inputResult.css('color', '#00ff2a');
  });

  failButton.click(function(e) {
    e.preventDefault();
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
    var storedPartId = localStorage.getItem('partId');
    if (storedPartId) {
        $('#pname').attr('part-id', storedPartId);
    }
    var serialPartNumber=$('#serial-no-field').val();
    // Add an event listener to the input field to update serialPartNumber on input changes
    $('#serial-no-field').on('input', function () {
        serialPartNumber = $(this).val();
    });
    // checkbox state capture
    var failCurrent = $('#current-checkbox').prop('checked')
    $('#current-checkbox').click(function () {
        failCurrent = $('#current-checkbox').prop('checked');
    });
    
    var failHr = $('#hr-checkbox').prop('checked')
    $('#hr-checkbox').click(function () {
        failHr = $('#hr-checkbox').prop('checked');
    });

    var failPairing = $('#pairing-checkbox').prop('checked')
    $('#pairing-checkbox').click(function () {
        failPairing = $('#pairing-checkbox').prop('checked');
    });

    var failBluetooth = $('#bluetooth-checkbox').prop('checked')
    $('#bluetooth-checkbox').click(function () {
        failBluetooth = $('#bluetooth-checkbox').prop('checked');
    });

    var failSleepMode = $('#sleep-mode-checkbox').prop('checked')
    $('#sleep-mode-checkbox').click(function () {
        failSleepMode = $('#sleep-mode-checkbox').prop('checked');
    });

    var failOther = $('#other-checkbox').prop('checked')
    $('#other-checkbox').click(function () {
        failOther = $('#other-checkbox').prop('checked');
    });


    $('#save-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: 'http://localhost:5000/api/post-programming-result-entry-api',
            type: 'POST',
            data: JSON.stringify({
                part_id: partId,
                serial_no: serialPartNumber,
                result: result,
                fail_current: failCurrent,
                fail_hr: failHr,
                fail_pairing: failPairing,
                fail_bluetooth: failBluetooth,
                fail_sleep_mode: failSleepMode,
                fail_other: failOther,
            }),
            contentType: 'application/json',
            success: function(response) {
                // handle successful response
                console.log(response);
    
                // Refresh the page
                // location.reload();
            },
            error: function(xhr, status, error) {
                // handle error response
                console.error(error);
            }
        });
    });

    // Trigger the form submission when the anchor is clicked
    $('#save-button').click(function() {
        $('#save-form').submit();
    });
});

