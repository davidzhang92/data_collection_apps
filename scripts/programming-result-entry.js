$(document).ready(function (){

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

    // handing POST request
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
    var failCurrent = $('#current-checkbox').prop('checked')
    var failHr = $('#hr-checkbox').prop('checked')
    var failPairing = $('#pairing-checkbox').prop('checked')
    var failBluetooth = $('#bluetooth-checkbox').prop('checked')    
    var failSleepMode = $('#sleep-mode-checkbox').prop('checked')
    var failOther = $('#other-checkbox').prop('checked')




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

