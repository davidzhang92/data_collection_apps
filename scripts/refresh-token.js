$(document).ready(function () {
	var accessToken = localStorage.getItem('accessToken');
    var lastActivityTime = Date.now();

    window.refreshToken = function(){

        $.ajax({
            url: 'http://' + window.location.hostname + ':4000/api/refresh_access_token_api',
            type: 'POST',
            
            contentType: 'application/json',
				headers: {
					'Authorization': accessToken // Include the token in the headers
				},
            success: function(response) {
                // handle successful response
                console.log(response.message);
                // alert(response.message);
                // Store the access token in local storage
                localStorage.setItem('accessToken', response.access_token);

            },
            error: function (xhr, error) {
                if (xhr.status === 401) {
                    alert(xhr.responseJSON.message);
                    window.location.href = '/login.html'
                    localStorage.removeItem('accessToken');
                } else if (xhr.status >= 400 && xhr.status < 600) {
                    alert(xhr.responseJSON.message);
                } else {
                    console.error(error);
                    alert('An error occurred while retrieving the data.');
                    window.location.href = '/login.html'
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
    if(Date.now() - lastActivityTime <= 1*60*1000) {
        window.refreshToken();
    }
    // Schedule the next check
    setTimeout(checkActivity, 5*1000);
}

// Start checking for user activity
checkActivity();

});
