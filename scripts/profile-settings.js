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
	
	// Get the token from local storage
	// Activate tooltip
	$('[data-toggle="tooltip"]').tooltip()
	$('.displayed-username').text(localStorage.getItem('userName'));

	//clear all field in modal window when it's hidden
	$('#addPartModal').on('hidden.bs.modal', function () {
		// Clear the fields here
		$('#add-part-number').val('');
		$('#add-part-description').val('');
		// Add more fields as needed
	});

	$('#cancel').click(function(e){
        e.preventDefault();
        if(window.history.length > 1){
            window.history.back();
        } else {
            window.location.href = '/menus/dashboard/dashboard.html'; 
        }
    });
	$('#username').val(localStorage.getItem('userName'))


	$('.body-form').on('submit', function(event) {
		event.preventDefault();
		var password = $('#new-password').val();
		var confirmPassword = $('#confirm-password').val();
	
		if (password === confirmPassword) {
			var validPassword = confirmPassword;
			} else {
				alert('Error: Password doesn\'t match, try again.');
				password = $('#new-password').val('');
				confirmPassword = $('#confirm-password').val('');
				validPassword =''
				return;
			}
	
			$.ajax({
				url: 'http://' + window.location.hostname + ':4000/api/user_profiles',
				type: 'PATCH',
				data: JSON.stringify({
					old_password : $('#old-password').val(),
					new_password : validPassword,
					user_id: localStorage.getItem('userId')
	
				}),
				contentType: 'application/json',
				beforeSend: function(xhr) { 
					xhr.setRequestHeader('Authorization', localStorage.getItem('accessToken')); 
				},
				success: function(response) {
					// handle successful response
					$('#old-password').val('');
					$('#new-password').val('');
					$('#confirm-password').val('');
					alert(response.message);
					console.log(response);
		
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
						alert('An error occurred while changing the password.');
					}
				}
			});
	});
    

    });
