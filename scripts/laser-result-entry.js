// -----initialization stateelement of page and rules---------
$('.laser-result-entry-sub-card').hide();
$('.laser-result-entry-sub-card-2').hide();
$('.export-laser-result-entry-sub-card').hide();
$('#input-result').text('');
$('#enable-serial-no-field').prop('checked', true);
$('#enable-data-matrix-field').prop('checked', true);
$('#enable-label-id-field').prop('checked', true);





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
    if ($('#pdesc').val() === '' && $('#wono').val().match(/^\d+$/) === null) {
        // Display an alert if both are empty
        alert('Error. Part No. and Wo No. are invalid or empty, please try again.');
    } 
    else if ($('#wono').val().match(/^\d+$/) === null) {
        // Display an alert if it's not a number
        alert('Error. Wo No is invalid or empty, please try again.');
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
        // Clear input fields inside the div with class "laser-result-entry-sub-card"
        $('.laser-result-entry-sub-card input[type="text"]').val('');
        // Clear all checkboxes inside the div with class "check-boxes-fail-group"
        $('.check-boxes-fail-group input[type="checkbox"]').prop('checked', false);
        $('.export-laser-result-entry-sub-card').hide();
        $('#export-button').text(exportOriginalText);
        $('#export-button').css('background-color', originalColor);
        $('#save-button').show();


        // Check if #pdesc is empty
        var InitialField = $('#pdesc').val().trim() === '' || $('#wono').val().match(/^\d+$/) === null;

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
            $('#wono').prop('readonly', isSelected);

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


    // Update the partId during page load if it's stored in localStorage 
    // (so that the part-id attribute wil contain part-id GUID value after page refresh)
    var storedPartId = localStorage.getItem('partId');
    if (storedPartId) {
        $('#pname').attr('part-id', storedPartId);
    }


    // checkbox state for each value field

    $('#enable-serial-no-field').change(function() {
        if(this.checked) {
            $('#serial-no-field').prop('readonly', true);
            $('#serial-no-field').prop('disabled', false);
        } else {
            $('#serial-no-field').prop('readonly', false);
            $('#serial-no-field').prop('disabled', true);
            $('#serial-no-field').val('')
        }
    });

    $('#enable-data-matrix-field').change(function() {
        if(this.checked) {
            $('#data-matrix-field').prop('readonly', true);
            $('#data-matrix-field').prop('disabled', false);
        } else {
            $('#data-matrix-field').prop('readonly', false);
            $('#data-matrix-field').prop('disabled', true);
            $('#data-matrix-field').val('')
        }
    });

    $('#enable-label-id-field').change(function() {
        if(this.checked) {
            $('#label-id-field').prop('readonly', true);
            $('#label-id-field').prop('disabled', false);
        } else {
            $('#label-id-field').prop('readonly', false);
            $('#label-id-field').prop('disabled', true);
            $('#label-id-field').val('')
        }
    });


    function PostAjax() {
        var serialNoField = $('#serial-no-field');
        var dataMatrixField = $('#data-matrix-field');
        var labelIdField = $('#label-id-field');
    
        var serialNoCheck = !serialNoField.prop('disabled') && serialNoField.val();
        var dataMatrixCheck = !dataMatrixField.prop('disabled') && dataMatrixField.val();
        var labelIdCheck = !labelIdField.prop('disabled') && labelIdField.val();
    
        // Check if all readonly fields are populated
        var allFieldsPopulated = true;
        if ($('#enable-serial-no-field').prop('checked') && !serialNoCheck) {
            allFieldsPopulated = false;
        }
        if ($('#enable-data-matrix-field').prop('checked') && !dataMatrixCheck) {
            allFieldsPopulated = false;
        }
        if ($('#enable-label-id-field').prop('checked') && !labelIdCheck) {
            allFieldsPopulated = false;
        }
    
        if (allFieldsPopulated) {
            $.ajax({
                url: 'http://' + window.location.hostname + ':4000/api/laser-result-entry-api',
                type: 'POST',
                data: JSON.stringify({
                    part_id: partId,
                    wo_no: $('#wono').val(),
                    serial_no: $('#serial-no-field').val(),
                    data_matrix: $('#data-matrix-field').val(),
                    label_id:$('#label-id-field').val(),
                    user_id: localStorage.getItem('userId')
                }),
                contentType: 'application/json',
                beforeSend: function(xhr) { 
                    xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
                },
                success: function(response) {
                    // handle successful response
                    console.log(response);
        
                    // Reset other variables
        
                    $('#serial-no-field').val('')
                    $('#data-matrix-field').val('')
                    $('#label-id-field').val('')
        
                    alert('Result submitted successfully.');
                },
                error: function(xhr, status, error) {
                    // handle error response
                    if (xhr.status === 400) {
                        // The response status is 400, indicating a duplicate
                        alert(xhr.responseJSON.message);
                        $('#serial-no-field').val('')
                        $('#data-matrix-field').val('')
                        $('#label-id-field').val('')
            
                    } else if (xhr.status === 401) {
                        alert(xhr.responseJSON.message);
                        window.location.href = '/login.html'
                        localStorage.removeItem('accessToken');
                    } else if (xhr.status >= 400 && xhr.status < 600) {
                        alert(xhr.responseJSON.message);
                    } else {
                        console.error(error);
                        alert('An error occurred while submitting the result.');
                        $('#input-result').text('');
                        // Reset other variables
                        result = ''; // Reset result
                        $('#serial-no-field').val('')
                        $('#data-matrix-field').val('')
                        $('#label-id-field').val('')
                        }
                    }
                });
        } 
    }


    
    $('#scan-field').on('keypress', function(e) {
        if (e.which == 13) {
            var value = $(this).val();
            var regex = /^\d+$/;

            if (regex.test(value)) {
                switch (value.length) {
                    case 13:
                        if ($('#serial-no-field').prop('disabled')) {
                            alert("Error : Product S/N field is disabled.");
                            $(this).val('');
                        } else {
                            $('#serial-no-field').val(value);
                            $('#scan-field').val('');
                            PostAjax();
                        }
                        break;
                    case 18:
                        if ($('#data-matrix-field').prop('disabled')) {
                            alert("Error : PCBA S/N field is disabled.");
                            $(this).val('');
                        } else {
                            $('#data-matrix-field').val(value);
                            $('#scan-field').val('');
                            PostAjax();
                        }
                        break;
                    case 10:
                        if ($('#label-id-field').prop('disabled')) {
                            alert("Error : Device ID field is disabled.");
                            $(this).val('');
                        } else {
                            $('#label-id-field').val(value);
                            $('#scan-field').val('');
                            PostAjax();
                        }
                        break;
                    default:
                        $(this).val('');
                        alert("Error: Data is not valid");
                        break;
                }
            } else {
                alert("Error: Data is not valid");
                $(this).val('');
            }
            e.preventDefault();
        }
    });

    







    //Laser Export Section
	// datepicker function for date to and date from
	$(function() {
		$("#date-from-field").datetimepicker({
			dateFormat: "yy-mm-dd hh:mm"
		});

		$("#date-to-field").datetimepicker({
			dateFormat: "yy-mm-dd hh:mm"
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
        var WoNo = $('#wono').val();
    
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://' + window.location.hostname + ':4000/api/laser_result_entry_api', true);
		xhr.responseType = 'blob';
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken'));
		xhr.onload = function(e) {
			if (this.status == 200) {
				var blob = new Blob([this.response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
				var downloadUrl = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = downloadUrl;
				a.download = "laser_report.xlsx";
				document.body.appendChild(a);
				a.click();
			} else if (this.status === 401) {
				alert('Unauthorized');
				window.location.href = '/login.html'
				localStorage.removeItem('accessToken');
			} else if (this.status >= 400 && this.status < 600) {
				alert('Error occurred while retrieving the data.');
			}
		};
		xhr.onerror = function() {
			alert('An error occurred while retrieving the data.');
		};
		xhr.send(JSON.stringify({
            part_id: partId,
            date_from: dateFrom,
            date_to: dateTo,
            wo_no :WoNo
            
		}));
	});

    
    

	//logout function, clear all access token upon log out
	$('#logout').click(function(){
		localStorage.clear();
    });



});
