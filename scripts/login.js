$(document).ready(function () {

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
                alert(response.message);
                // Store the access token in local storage
                localStorage.setItem('accessToken', response.access_token);
                sessionStorage.setItem('refreshToken', response.refresh_token);


                // Redirect to a certain page
                window.location.href = '/menus/dashboard/dashboard.html';
            },
            error: function(xhr, status, error) {
                // handle error response
                if (xhr.status === 400) {
                    // The response status is 400, indicating a duplicate
                    alert(xhr.responseJSON.message);
                    $('#input-password').val('');
                } else {
                    console.error(error);
                    alert('login error');
                    $('#input-password').val('');
                }
            }
        });
    });
});
