$(document).ready(function () {

    var lastActivityTime = Date.now();


    window.refreshToken = function(){
        $.ajax({
            
            url: 'http://' + window.location.hostname + ':4000/api/refresh_access_token_api',
            type: 'POST',
            
            contentType: 'application/json',
            beforeSend: function(xhr) { 
                xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
            },
            success: function(response) {
                // handle successful response
                console.log(response.message);
                // alert(response.message);
                // Store the access token in local storage
                localStorage.setItem('accessToken', response.access_token);
                localStorage.setItem('userName',response.username)
                localStorage.setItem('userId',response.user_id)
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

   /// Event listeners for mouse and keyboard events
$(document).on('mousemove click keypress', function() {
    lastActivityTime = Date.now();
});

// Listen for AJAX requests
$(document).ajaxSend(function(event, xhr, settings) {
    if (settings.url !== 'http://' + window.location.hostname + ':4000/api/refresh_access_token_api') {
        lastActivityTime = Date.now();
    }
});

// Function to check for user activity within the last 120 minutes
function checkActivity() {
    if(Date.now() - lastActivityTime <= 60*60*1000) {
        window.refreshToken();
        console.log (Date.now() - lastActivityTime)
    }
    // Schedule the next check
    setTimeout(checkActivity, 60*60*1000);
}

// Start checking for user activity
checkActivity();


});
