// -----initialization state of page and rules---------
$('.air-leaktest-result-entry-sub-card').hide();
$('.air-leaktest-result-entry-sub-card-2').hide();
$('.water-leaktest-result-entry-sub-card').hide();
$('.water-leaktest-result-entry-sub-card-2').hide();
$('#defect-code-field').prop('disabled', true);


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
        var leaktestType = $('#leaktest-type-selection').val()

    
        // Check if the input with id 'pdesc' is empty
        if ($('#pdesc').val() === '') {
          // Display an alert if it's empty
          alert('Error: Part No. is invalid or empty, please try again.');
        } 
        else if (leaktestType === '' || leaktestType !== 'Air' && leaktestType !== 'Water') {
            alert('Error: Leaktest Type cannot be empty, please try again.');
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
        var InitialField = $('#pdesc').val().trim() === '';

        if (InitialField) {
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
        var InitialField = $('#pdesc').val().trim() === '' || ($('#leaktest-type-selection').val() !== 'Air' && $('#leaktest-type-selection').val() !== 'Water');



        // Toggle the selected state only if #pdesc is not empty
        if (!InitialField) {
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
            $('#leaktest-type-selection').prop('disabled', isSelected);

            // Toggle the visibility of the elements with class leaktest-result-entry-sub-card
            const leaktestType = $('#leaktest-type-selection').val();
            if (leaktestType === 'Air') {
                $('.air-leaktest-result-entry-sub-card').toggle(isSelected);
                $('.air-leaktest-result-entry-sub-card-2').toggle(isSelected);
                $('.water-leaktest-result-entry-sub-card').hide();
                $('.water-leaktest-result-entry-sub-card-2').hide();
            } else if (leaktestType === 'Water') {
                $('.water-leaktest-result-entry-sub-card').toggle(isSelected);
                $('.water-leaktest-result-entry-sub-card-2').toggle(isSelected);
                $('.air-leaktest-result-entry-sub-card').hide();
                $('.air-leaktest-result-entry-sub-card-2').hide();
            }
        }
    });

 
  // fail/pass button function for AIR leaktest

  var airInputResult = $('#air-input-result');

  var isPassButtonPress = 0; // Initialize the variable

  // Click event handler for the "PASS" button 
  $('#air-pass-button').click(function (e) {
      e.preventDefault();
      // Set the result text and color
      airInputResult.text('PASS');
      airInputResult.css('color', '#00ff2a');
      $('#defect-code-field').val('');
      $('#defect-desc').val('');
      $('#defect-code-field').attr('defect-id', '');
      $('#defect-code-field').prop('disabled', true);
      localStorage.removeItem('defectId');
      
      // Set isPassButtonPress to 1 when PASS button is clicked
      isPassButtonPress = 1;
  });

    // Click event handler for the "FAIL" button
  $('#air-fail-button').click(function (e) {
        e.preventDefault();


        $('#defect-code-field').prop('disabled', false);
        $('#defect-desc').prop('readonly', false);
        airInputResult.text('FAIL');
        airInputResult.css('color', '#ff0000');

        // Check if isPassButtonPress is 1, if so, reset it to 0 and return without showing the alert
        if (isPassButtonPress === 1) {
            isPassButtonPress = 0;
            return;
        }

  });

// fail/pass button function for WATER leaktest

var waterInputResult = $('#water-input-result');

var isPassButtonPress = 0; // Initialize the variable

    // Click event handler for the "PASS" button 
    $('#water-pass-button').click(function (e) {
        e.preventDefault();
        // Set the result text and color
        waterInputResult.text('PASS');
        waterInputResult.css('color', '#00ff2a');
        $('#defect-code-field').val('');
        $('#defect-desc').val('');
        $('#defect-code-field').attr('defect-id', '');
        $('#defect-code-field').prop('disabled', true);
        localStorage.removeItem('defectId');
        
        // Set isPassButtonPress to 1 when PASS button is clicked
        isPassButtonPress = 1;
    });

    // Click event handler for the "FAIL" button
    $('#water-fail-button').click(function (e) {
        e.preventDefault();


        $('#defect-code-field').prop('disabled', false);
        $('#defect-desc').prop('readonly', false);
        waterInputResult.text('FAIL');
        waterInputResult.css('color', '#ff0000');

        // Check if isPassButtonPress is 1, if so, reset it to 0 and return without showing the alert
        if (isPassButtonPress === 1) {
            isPassButtonPress = 0;
            return;
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

    $('#air-pass-button').click(function () {
        airLeaktestResult = $('#air-input-result').text();
        
    });

    $('#air-fail-button').click(function () {
        airLeaktestResult = $('#air-input-result').text();
    });

    $('#water-pass-button').click(function () {
        waterLeaktestResult = $('#water-input-result').text();
        
    });

    $('#water-fail-button').click(function () {
        waterLeaktestResult = $('#water-input-result').text();
    });
    // Update the partId during page load if it's stored in localStorage 
    // (so that the part-id attribute wil contain part-id GUID value after page refresh)
    var storedPartId = localStorage.getItem('partId');
    if (storedPartId) {
        $('#pname').attr('part-id', storedPartId);
    }

        
// result value assignment and checking
    var housingPartNumber=$('#housing-no-field-airtest').val();
    // Add an event listener to the input field to update serialPartNumber on input changes
    $('#housing-no-field-airtest').on('input', function () {
      housingPartNumber = $('#housing-no-field-airtest').val();
    });
    $('#housing-no-field-airtest').on('keydown', function(event) {
        if (event.keyCode === 13) { // Check if the key pressed is Enter (key code 13)
            event.preventDefault(); // Prevent the default behavior of the Enter key
            $('#fine-field').focus();
        }
        $("#housing-no-field-airtest").on("blur", function() {
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
                defect_id: $('#defect-code-field').attr('defect-id'),
                housing_no: housingPartNumber,
                air_leaktest_result: $('#air-input-result').text(),
                fine_value: fineValue,
                gross_value: grossValue,
                others_value: othersValue,
                user_id: localStorage.getItem('userId')
            }),
            contentType: 'application/json',
			beforeSend: function(xhr) { 
				xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
			},	
            success: function(response) {
                // handle successful response
                console.log(response);

                $('#air-input-result').text('');
                // Reset other variables
                result = ''; // Reset result
                $('#housing-no-field-airtest').val('')
                $('#fine-field').val('')
                $('#gross-field').val('')
                $('#others-field').val('')
                $('#defect-code-field').val('')
                $('#defect-code-field').attr('defect-id', '');
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
					alert(error);
				}
			}
        });
    });

    // Trigger the form submission when the anchor is clicked
    $('#air-save-button').click(function() {
        // Get the values of serial number and result
        var housingPartNumber = $('#housing-no-field-airtest').val();
        var resultValue = $('#air-input-result').text();


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

        // Check if result is "FAIL" and defectId is empty
        if (result.trim() === 'FAIL' && $('#defect-code-field').attr('defect-id').trim() === '') {
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
