$(document).ready(function (){

    // fail/pass button function
    const deleteBtn = $('#select-button');
  if (deleteBtn.hasClass('ph-btn-disabled')) {
    deleteBtn.removeAttr('href');
    deleteBtn.attr('disabled', true);
  }

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

    var addPartId='';
    var serialPartNumber='';
    var result='';
    var partId='';


    $('#select-button').click(function () {
        var partId = $('#pname').attr('part-id'); // Get the page-number value from the clicked link
       
        
    });

    // Event listener for the input field
    $("#label-serial-no").on("keyup", function(event) {
        // Check if the Enter key (keycode 13) was pressed
        if (event.keyCode === 13) {
            // Get the value of the input field
            var serialPartNumber = $(this).val();

        }
    });


    $('#save-button').on('submit', function(event) {
        event.preventDefault();

        var failOther = $('#other-checkbox').prop('checked')

  


        $.ajax({
            url: 'http://localhost:5000/api/post_part_api',
            type: 'POST',
            data: JSON.stringify({
                partId: addPartNumber,
                part_description: addPartDescription
            }),
            contentType: 'application/json',
            success: function(response) {
                // handle successful response
                console.log(response);

                // Close the edit dialog box
                $('#addPartModal').modal('hide');

                // Clear input fields
                $('#add-part-number').val('');
                $('#add-part-description').val('');

                // Refresh the page
                location.reload();
            },
            error: function(xhr, status, error) {
                // handle error response
                console.error(error);
            }
        });
    });


});

