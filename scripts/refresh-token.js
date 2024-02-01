$(document).ready(function () {
    var accessToken = localStorage.getItem('accessToken');
    var lastActivityTime = Date.now();

    window.refreshToken = function(){
        var refreshToken = sessionStorage.getItem('refreshToken');
        $.ajax({
            url: 'http://' + window.location.hostname + ':4000/api/refresh_token_api',
            type: 'POST',
            data: JSON.stringify({
				refresh_token : refreshToken
			}),
            contentType: 'application/json',
            success: function(response) {
                localStorage.setItem('accessToken', response.access_token);
                console.log(response);
            },
            headers: {
				'Authorization': accessToken // Include the token in the headers
			},	
            error: function(xhr, status, error) {
                if (xhr.status === 401) {
                    alert(xhr.responseJSON.message);
                    window.location.href = '/login.html'
                    localStorage.removeItem('accessToken');
                } else if (xhr.status === 400) {
                    alert(xhr.responseJSON.message);
                } else if (xhr.status >= 400 && xhr.status < 600) {
                    alert(xhr.responseJSON.message);
                } else {
                    console.error(error);
                    alert('An error occurred refreshing the token.');
                }
            },
        });
    }

    // Event listeners for mouse and keyboard events
    $(document).on('mousemove click keypress', function() {
        lastActivityTime = Date.now();
    });

    // Function to check for user activity within the last 120 minutes
    function checkActivity() {
        if(Date.now() - lastActivityTime <= 120*60*1000) {
            window.refreshToken();
        }
        // Schedule the next check
        setTimeout(checkActivity, 5*1000);
    }

    // Start checking for user activity
    checkActivity();
});
