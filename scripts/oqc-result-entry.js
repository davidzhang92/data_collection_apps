// -----initialization stateelement of page and rules---------
$('.oqc-result-entry-sub-card').hide();
$('.oqc-result-entry-sub-card-2').hide();
$('#input-result').text('');
$('.defect-code-field').attr('defect-id', '');
$('.defect-code-field').prop('disabled', true);



$(document).ready(function (){

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
        // Clear input fields inside the div with class "oqc-result-entry-sub-card"
        $('.oqc-result-entry-sub-card input[type="text"]').val('');
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

            // Toggle the visibility of the elements with class oqc-result-entry-sub-card
            $('.oqc-result-entry-sub-card').toggle(isSelected);
            $('.oqc-result-entry-sub-card-2').toggle(isSelected);
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
        $('.defect-code-field').val('');
        $('#defect-desc').val('');
        $('.defect-code-field').attr('defect-id', '');
        $('.defect-code-field').prop('disabled', true);
        localStorage.removeItem('defectId');
        
        // Set isPassButtonPress to 1 when PASS button is clicked
        isPassButtonPress = 1;
    });

    // Click event handler for the "FAIL" button
    $('#fail-button').click(function (e) {
        e.preventDefault();
    
  
        $('.defect-code-field').prop('disabled', false);
        $('#defect-desc').prop('readonly', false);
        inputResult.text('FAIL');
        inputResult.css('color', '#ff0000');
    
        // Check if isPassButtonPress is 1, if so, reset it to 0 and return without showing the alert
        if (isPassButtonPress === 1) {
            isPassButtonPress = 0;
            return;
        }

    });
    

    // ---handing POST request---

    // Initialize partId and result variables
    var partId = localStorage.getItem('partId') || '';


    // Handling the button clicks
    $('#select-button').click(function () {
        partId = $('#pname').attr('part-id');
    // Store the partId in localStorage
        localStorage.setItem('partId', partId);
    });



    // $('#fail-button').click(function () {
    //     result = $('#input-result').text();
    // });
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
            $('.defect-code-field').focus();
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



    $('#save-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: 'http://' + window.location.hostname + ':4000/api/oqc-result-entry-api',
            type: 'POST',
            data: JSON.stringify({
                part_id: partId,
                defect_id: $('.defect-code-field').attr('defect-id'),
                serial_no: serialNumber,
                result: $('#input-result').text(),
                user_id: localStorage.getItem('userId')
            }),
            contentType: 'application/json',
			beforeSend: function(xhr) { 
				xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
			},
            success: function(response) {
                // handle successful response
                console.log(response);
    
                $('#input-result').text('');
                $('#serial-no-field').val('')
                $('.defect-code-field').val('')
                $('.defect-code-field').attr('defect-id', '');
                defectId='';
                $('#defect-desc').val('')
                localStorage.removeItem('defectId');
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
            var serialNumber = $('#serial-no-field').val();
            var result = $('#input-result').text();
    
    
            // Check if serial number is empty
            if (serialNumber.trim() === '') {
                alert('Serial number cannot be empty.');
                return; // Prevent further processing if serial number is empty
            }
    
    
            // Check if result is empty
            if (result.trim() === '') {
            alert('Result cannot be empty.');
            return; // Prevent further processing if result is empty
            }
    
            // Check if result is "FAIL" and defectId is empty
            if (result.trim() === 'FAIL' && $('.defect-code-field').attr('defect-id').trim() === '') {
            alert('Error : Defect Code is invalid or empty, please try again.');
            return; // Prevent further processing if result is "FAIL" and defectId is empty
            }
    
            // If all checks pass, proceed with the form submission
            $('#save-form').submit();
    
            });

    //logout function, clear all access token upon log out
	$('#logout').click(function(){
		localStorage.clear();
    });
    
});

