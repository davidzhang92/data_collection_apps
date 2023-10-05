// -----initialization state of page and rules---------
$('.programming-result-entry-sub-card').hide();
$('.programming-result-entry-sub-card-2').hide();

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
        // Clear input fields inside the div with class "programming-result-entry-sub-card"
        $('.programming-result-entry-sub-card input[type="text"]').val('');
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

            // Toggle the visibility of the elements with class programming-result-entry-sub-card
            $('.programming-result-entry-sub-card').toggle(isSelected);
            $('.programming-result-entry-sub-card-2').toggle(isSelected);
        }
    });


// fail/pass button function

    var inputResult = $('#input-result');

    // Click event handler for the "PASS" button
    $('#pass-button').click(function (e) {
        e.preventDefault();
        
        // Disable the entire div and its child elements
        $('.check-boxes-fail-group').addClass('disabled');
        $('.check-boxes-fail-group input').prop('disabled', true);
    // Clear all checkboxes inside the div with class "check-boxes-fail-group"
    $('.check-boxes-fail-group input[type="checkbox"]').prop('checked', false);
        // Set the result text and color
        inputResult.text('PASS');
        inputResult.css('color', '#00ff2a');
    });

    // Click event handler for the "FAIL" button
    $('#fail-button').click(function (e) {
        e.preventDefault();
        
        // Enable the entire div and its child elements
        $('.check-boxes-fail-group').addClass('disabled');
        $('.check-boxes-fail-group input').prop('disabled', false);
        
        // Set the result text and color
        inputResult.text('FAIL');
        inputResult.css('color', '#ff0000');
    });

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
        failCurrent = false; // Reset failCurrent
        failHr = false; // Reset failHr
        failPairing = false; // Reset failPairing
        failBluetooth = false; // Reset failBluetooth
        failSleepMode = false; // Reset failSleepMode
        failOther = false; // Reset failOther
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
    $('#serial-no-field').on('keydown', function(event) {
        if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
            event.preventDefault(); // Prevent the default behavior of the Enter key
        }
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
            url: 'http://localhost:4000/api/post-programming-result-entry-api',
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
                // Clear input fields inside the div with class "programming-result-entry-sub-card"
                $('.programming-result-entry-sub-card input[type="text"]').val('');
                // Clear all checkboxes inside the div with class "check-boxes-fail-group"
                $('.check-boxes-fail-group input[type="checkbox"]').prop('checked', false);
                
                $('#input-result').text('');
                // Reset other variables
                result = ''; // Reset result
                failCurrent = false; // Reset failCurrent
                failHr = false; // Reset failHr
                failPairing = false; // Reset failPairing
                failBluetooth = false; // Reset failBluetooth
                failSleepMode = false; // Reset failSleepMode
                failOther = false; // Reset failOther
                serialPartNumber = ''; // Reset serialPartNumber
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
        var serialNumber = $('#serial-no-field').val();
        var resultValue = $('#input-result').text();

        // Check if serial number is empty
        if (serialNumber.trim() === '') {
            alert('Serial number cannot be empty.');
            return; // Prevent further processing if serial number is empty
        }

        // Check if result is empty
        if (resultValue.trim() === '') {
            alert('Result cannot be empty.');
            return; // Prevent further processing if result is empty
        }

        // If the result is FAIL, check if at least one fail condition is true
        if (resultValue === 'FAIL') {
            if (
                !failCurrent &&
                !failHr &&
                !failPairing &&
                !failBluetooth &&
                !failSleepMode &&
                !failOther
            ) {
                alert('At least one fail condition must be true for a FAIL result.');
                return; // Prevent further processing if no fail conditions are true
            }
        }

        // If all checks pass, proceed with the form submission
        $('#save-form').submit();
    });
});

