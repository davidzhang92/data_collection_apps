$(document).ready(function () {

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

    // Activate tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // Attach the submit event handler to the form
    $('.login-form-content').on('submit', function(event) {
        event.preventDefault();

        // Get the username and password values when the form is submitted
        var username = $('#input-username').val();
        var password = $('#input-password').val();

        $.ajax({
            url: 'http://' + window.location.hostname + ':4000/api/user_authentication_api',
            type: 'POST',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            contentType: 'application/json',
            success: function(response) {
                // handle successful response
                console.log(response.message);
                // alert(response.message);
                // Store the access token in local storage
                localStorage.setItem('accessToken', response.access_token);
                localStorage.setItem('userName',response.username)
                localStorage.setItem('userId',response.user_id)
                // sessionStorage.setItem('refreshToken', response.refresh_token);


                // Redirect to a certain page
                window.location.href = '/menus/dashboard/dashboard.html';
            },
           error: function(xhr, status, error) {
                // handle error response
                if (xhr.status) {
                    alert(xhr.responseJSON.message);
                    $('#input-password').val('');
                } else {
                    console.error(error);
                    alert('Error: Backend server is not reachable. Please try again later.');
                    $('#input-password').val('');
                }
            }
        });
    });
});
